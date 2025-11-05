import Bottleneck from 'bottleneck';
import { Op, Transaction } from 'sequelize';
import Sim, { SimAttributes } from '../../../db/models/Sims';
import { ProviderIdentity, SimStatus } from '@travelpulse/interfaces';
import { APIRequest, AxiosError, isAxiosError } from '@travelpulse/api-service';

import {
	AIRALO_USAGE_ENDPOINT,
	AiraloUsagePayload,
	DEFAULT_BATCH_SIZE,
	DEFAULT_CONCURRENCY,
	AbortError,
	fetchAccessToken,
	maskIccid,
	parseRetryAfter,
	RETRY_OPTIONS,
	toNumber,
	retryWithBackoff,
	wait,
} from '../job.util';
import dbConnect from '../../../db';

const limiter = new Bottleneck({
	maxConcurrent: Math.max(
		1,
		Number(process.env.USAGE_POLL_CONCURRENCY || DEFAULT_CONCURRENCY)
	),
});

async function fetchUsage(iccid: string, token: string) {
	const url = `${AIRALO_USAGE_ENDPOINT}/${encodeURIComponent(iccid)}/usage`;

	return retryWithBackoff(async () => {
		try {
			const response = await APIRequest.get<AiraloUsagePayload>(url, {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`,
				},
				timeout: 15000,
			});

			if (response.status === 200) {
				return response.data;
			}

			if (response.status === 429) {
				const retryMs = parseRetryAfter(
					response.headers['retry-after'] as string | undefined
				);
				if (retryMs && retryMs > 0) {
					await wait(retryMs);
				}
				throw new Error('Rate limited by Airalo');
			}

			if (response.status >= 500) {
				throw new Error(`Airalo error ${response.status}`);
			}

			throw new AbortError(
				`Unexpected Airalo status ${response.status} for ICCID ${iccid}`
			);
		} catch (err: unknown) {
			if (isAxiosError(err)) {
				const error = err as AxiosError;
				const status = error.response?.status;
				if (status && status >= 500) {
					throw error;
				}

				if (status === 429) {
					const retryMs = parseRetryAfter(
						error.response?.headers?.['retry-after'] as
							| string
							| undefined
					);
					if (retryMs && retryMs > 0) {
						await wait(retryMs);
					}
					throw error;
				}

				if (status && status >= 400) {
					throw new AbortError(
						`Received status ${status} for ICCID ${iccid}`
					);
				}
			}

			throw err;
		}
	}, RETRY_OPTIONS);
}

async function processSim(sim: Sim, token: string, transact: Transaction) {
	try {
		const usage = await fetchUsage(sim.iccid, token);
		const payload = usage.data ?? {};
		const totalMb = toNumber(payload.total);
		const remainingMb = toNumber(payload.remaining);
		const remainingVoice = toNumber(payload.remaining_voice);
		const remainingText = toNumber(payload.remaining_text);
		const totalVoice = toNumber(payload.total_voice);
		const totalText = toNumber(payload.total_text);
		const status = payload.status ?? null;

		type SimUsageUpdate = Partial<
			Pick<
				SimAttributes,
				| 'status'
				| 'total'
				| 'lastUsageFetchAt'
				| 'updatedAt'
				| 'remaining'
				| 'totalText'
				| 'remainingText'
				| 'totalVoice'
				| 'remainingVoice'
			>
		>;

		const updates: SimUsageUpdate = {};
		let nextStatus = sim.status;

		if (status && sim.status !== status) {
			updates.status = status;
		}

		if (totalMb && totalMb !== sim.total) {
			updates.total = totalMb;
		}

		if (remainingMb && remainingMb !== sim.remaining) {
			updates.remaining = remainingMb;
		}

		if (totalVoice && totalVoice !== sim.totalVoice) {
			updates.totalVoice = totalVoice;
		}

		if (totalText && totalText !== sim.totalText) {
			updates.totalText = totalText;
		}

		if (remainingVoice && remainingVoice !== sim.remainingVoice) {
			updates.remainingVoice = remainingVoice;
		}

		if (remainingText && remainingText !== sim.remainingText) {
			updates.remainingText = remainingText;
		}

		const consumed =
			totalMb !== null && remainingMb !== null
				? totalMb - remainingMb
				: null;

		if (
			sim.status === SimStatus.NOT_ACTIVE &&
			(status === SimStatus.ACTIVE || (consumed !== null && consumed > 0))
		) {
			nextStatus = SimStatus.ACTIVE;
		}

		if (nextStatus !== sim.status) {
			updates.status = nextStatus;
		}

		const now = new Date();
		updates.lastUsageFetchAt = now;
		updates.updatedAt = now;

		if (Object.keys(updates).length > 0) {
			await Sim.update(updates, {
				where: { id: sim.id },
				transaction: transact,
			});
		}

		const remoteStatusForLog = status;

		console.log(
			`[ESIM USAGE] iccid=${maskIccid(sim.iccid)} local=${sim.status}->${nextStatus} remote=${remoteStatusForLog} total=${
				totalMb ?? 'n/a'
			} remaining=${remainingMb ?? 'n/a'}`
		);
	} catch (error) {
		const err = error as Error | AxiosError;
		console.error(
			`[ESIM USAGE] iccid=${maskIccid(sim.iccid)} error=${err.message}`,
			err
		);
	}
}

export async function runEsimUsageJob() {
	const batchSize = Math.max(
		1,
		Number(process.env.USAGE_POLL_BATCH_SIZE || DEFAULT_BATCH_SIZE)
	);

	if (!AIRALO_USAGE_ENDPOINT) {
		throw new Error('Airalo API URL not configured for usage polling');
	}

	const transact = await dbConnect.transaction();

	try {
		const token = await fetchAccessToken(ProviderIdentity.AIRALO, transact);

		let lastId = 0;
		while (true) {
			const sims = await Sim.findAll({
				where: {
					status: {
						[Op.in]: [SimStatus.NOT_ACTIVE, SimStatus.ACTIVE],
					},
					id: {
						[Op.gt]: lastId,
					},
				},
				order: [['id', 'ASC']],
				limit: batchSize,
				transaction: transact,
			});

			if (sims.length === 0) {
				console.log(
					'\n[ESIM USAGE] No more SIMs to process, exiting\n'
				);

				break;
			}

			lastId = sims[sims.length - 1].id;

			await Promise.all(
				sims.map((sim) =>
					limiter.schedule(() => processSim(sim, token, transact))
				)
			);
		}

		await transact.commit();
	} catch (error) {
		if (transact) await transact.rollback();
		throw error;
	}
}
