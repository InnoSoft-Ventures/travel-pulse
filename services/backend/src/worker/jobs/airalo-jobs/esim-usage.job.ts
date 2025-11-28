import Bottleneck from 'bottleneck';
import { Op, Transaction } from 'sequelize';
import Sim from '../../../db/models/Sims';
import { ProviderIdentity, SimStatus } from '@travelpulse/interfaces';
import {
	RequestService,
	AxiosError,
	isAxiosError,
} from '@travelpulse/api-service';

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
import PackageHistory from '../../../db/models/PackageHistory';
import { getActivePackageForSim } from '../../../services/package-history.service';
import { dateJs } from '@travelpulse/utils';

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
			const response = await RequestService(
				token
			).get<AiraloUsagePayload>(url, {
				baseURL: undefined,
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
		const expiredAt = payload.expired_at ?? null;
		const isUnlimited = payload.is_unlimited ?? null;

		// Update active package usage/state instead of Sim columns
		const activePackage = await getActivePackageForSim(sim.id, transact);

		if (activePackage) {
			const phUpdates: Partial<PackageHistory> = {} as any;

			if (typeof totalMb === 'number') phUpdates.totalData = totalMb;

			if (typeof remainingMb === 'number')
				phUpdates.remainingData = remainingMb;

			if (typeof totalVoice === 'number')
				phUpdates.totalVoice = totalVoice;

			if (typeof remainingVoice === 'number')
				phUpdates.remainingVoice = remainingVoice;

			if (typeof totalText === 'number') phUpdates.totalText = totalText;

			if (typeof remainingText === 'number')
				phUpdates.remainingText = remainingText;

			if (expiredAt) {
				phUpdates.expiresAt = new Date(expiredAt);
			} else if (status === SimStatus.ACTIVE) {
				// Calculate expiresAt based on validityDays if not provided and if status is ACTIVE
				const newExpiry = dateJs();
				newExpiry.add(activePackage.validityDays || 0, 'day');

				phUpdates.expiresAt = newExpiry.toDate();
			}

			if (isUnlimited !== null)
				phUpdates.isUnlimited = Boolean(isUnlimited);

			if (status) phUpdates.status = status as SimStatus;

			// Set activation date if not already set and status is ACTIVE
			if (status === SimStatus.ACTIVE && !activePackage.activatedAt) {
				phUpdates.activatedAt = dateJs().toDate();
			}

			if (Object.keys(phUpdates).length > 0) {
				await PackageHistory.update(phUpdates as any, {
					where: { id: activePackage.id },
					transaction: transact,
				});
			}
		}

		// Only update lastUsageFetchAt on Sim
		const now = new Date();
		await Sim.update(
			{ lastUsageFetchAt: now, updatedAt: now },
			{ where: { id: sim.id }, transaction: transact }
		);

		console.log(
			`[ESIM USAGE] iccid=${maskIccid(sim.iccid)} status=${status} total=${
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
