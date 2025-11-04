import { PackageType } from '@travelpulse/interfaces';

export interface ProviderOrderRequest {
	packageId: string;
	type: PackageType;
	quantity: number;
	description: string;
}
