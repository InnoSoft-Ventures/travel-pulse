// snowflake.ts
import os from 'os';
import crypto from 'crypto';

const EPOCH = 1730313600000n; // 2024-10-31T00:00:00Z; pick & never change
const WORKER_BITS = 10n; // up to 1024 workers
const SEQ_BITS = 12n; // up to 4096 IDs/ms/worker
const MAX_WORKER_ID = (1n << WORKER_BITS) - 1n;
const MAX_SEQUENCE = (1n << SEQ_BITS) - 1n;

const workerId = (() => {
	// Stable-ish worker id (env > hostname hash > random). Ensure 0..MAX_WORKER_ID
	const fromEnv = process.env.WORKER_ID;
	if (fromEnv) return BigInt(Number(fromEnv) & Number(MAX_WORKER_ID));
	const h = crypto.createHash('sha1').update(os.hostname()).digest();
	const n = (h[0] << 2) ^ (h[1] << 1) ^ h[2];
	return BigInt(n & Number(MAX_WORKER_ID));
})();

let lastMs = -1n;
let seq = 0n;

function nowMs(): bigint {
	return BigInt(Date.now());
}

function tilNextMs(ts: bigint): bigint {
	let t = nowMs();
	while (t <= ts) t = nowMs();
	return t;
}

/** Monotonic, sortable 64-bit Snowflake-style ID (as BigInt). */
export function nextSnowflake(): bigint {
	let current = nowMs();

	// Handle clock rollback
	if (current < lastMs) {
		const drift = lastMs - current;
		// Wait up to 3ms; if still behind, jump to lastMs
		if (drift <= 3n) current = tilNextMs(lastMs);
		else current = lastMs;
	}

	if (current === lastMs) {
		seq = (seq + 1n) & MAX_SEQUENCE;
		if (seq === 0n) current = tilNextMs(lastMs); // seq overflow → next ms
	} else {
		seq = 0n;
	}

	lastMs = current;

	const timePart = (current - EPOCH) << (WORKER_BITS + SEQ_BITS);
	const workerPart = workerId << SEQ_BITS;
	return timePart | workerPart | seq;
}

/** Short, uppercase base36 string */
function toBase36(id: bigint): string {
	return id.toString(36).toUpperCase();
}

/** Public helper: ORD-<base36> (sortable lexicographically if same length) */
export function generateOrderNumber(): string {
	return `ORD-${toBase36(nextSnowflake())}`;
}
