import { SIMDetails } from '@travelpulse/interfaces';
import { copyUtil } from '@travelpulse/utils';

export interface SimUtilConfig {
	copyField<Key extends keyof SIMDetails>(
		keyField: Key,
		message: string
	): void;
}

export class SimUtil implements SimUtilConfig {
	private sim: SIMDetails;

	constructor(sim: SIMDetails) {
		this.sim = sim;
	}

	copyField<Key extends keyof SIMDetails>(keyField: Key, message: string) {
		if (!this.sim) return;

		const value = this.sim[keyField];

		if (!value) return;

		copyUtil(String(value), message);
	}
}
