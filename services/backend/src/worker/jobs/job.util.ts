import { Transaction } from 'sequelize';
import { AIRALO_API_URL as PROVIDER_AIRALO_URL } from '@travelpulse/providers';
import dbConnect from '../../db';
import { providerTokenHandler } from '../../services/provider-token.service';
import { ProviderIdentity, SimStatus } from '@travelpulse/interfaces';

export interface AiraloUsagePayload {
	data: {
		total: number;
		remaining: number;
		status: SimStatus;
		remaining_voice: number;
		remaining_text: number;
		total_voice: number;
		total_text: number;
	};
}

export const DEFAULT_CONCURRENCY = 10;
export const DEFAULT_BATCH_SIZE = 50;
export interface RetryOptions {
	retries: number;
	factor: number;
	minTimeout: number;
	maxTimeout: number;
	randomize: boolean;
}

export class AbortError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AbortError';
	}
}

export const RETRY_OPTIONS: RetryOptions = {
	retries: 3,
	factor: 2,
	minTimeout: 500,
	maxTimeout: 4000,
	randomize: true,
};

export const RAW_AIRALO_BASE_URL =
	process.env.AIRALO_API_URL || PROVIDER_AIRALO_URL || '';
export const AIRALO_BASE_URL = RAW_AIRALO_BASE_URL.replace(/\/$/, '');
export const AIRALO_USAGE_ENDPOINT = AIRALO_BASE_URL
	? `${AIRALO_BASE_URL}/sims`
	: '';

export function maskIccid(iccid: string): string {
	if (!iccid) return 'unknown';
	const visible = iccid.slice(-6);
	return `****${visible}`;
}

export function toNumber(value: unknown): number | null {
	if (value === null || value === undefined) {
		return null;
	}
	const num = Number(value);
	return Number.isFinite(num) ? num : null;
}

export function parseRetryAfter(header: string | undefined): number | null {
	if (!header) return null;
	const seconds = Number(header);
	if (Number.isFinite(seconds)) {
		return seconds * 1000;
	}
	const date = new Date(header);
	const delay = date.getTime() - Date.now();
	return delay > 0 ? delay : null;
}

export async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryWithBackoff<T>(
	operation: () => Promise<T>,
	options: RetryOptions
): Promise<T> {
	let attempt = 0;
	let delay = options.minTimeout;

	while (true) {
		try {
			return await operation();
		} catch (error) {
			if (error instanceof AbortError) {
				throw error;
			}

			if (attempt >= options.retries) {
				throw error;
			}

			attempt += 1;
			const randomMultiplier = options.randomize
				? 1 + Math.random() * 0.5
				: 1;
			const timeout = Math.min(
				options.maxTimeout,
				delay * randomMultiplier
			);
			await wait(timeout);
			delay = Math.min(
				options.maxTimeout,
				Math.max(options.minTimeout, delay * options.factor)
			);
		}
	}
}

export async function fetchAccessToken(
	provider: ProviderIdentity,
	transact?: Transaction
): Promise<string> {
	try {
		if (!transact) {
			transact = await dbConnect.transaction();
		}

		const tokenFetcher = providerTokenHandler(transact);
		const token = await tokenFetcher(provider);

		return token;
	} catch (error) {
		throw error;
	}
}
