import { PackageType, ProviderIdentity } from './enums';

export interface ProviderFactoryData {
	orderItemId: number;
	packageId: string;
	provider: ProviderIdentity;
	quantity: number;
	type: PackageType.SIM;
	startDate: string;
	dataAmount: number;
	voice: number;
	text: number;
}

export interface ProviderOrderResponse extends ProviderFactoryData {
	externalRequestId: string;
}

export interface ProviderStrategy {
	createOrder(data: ProviderFactoryData): Promise<ProviderOrderResponse>;
}

export type ProviderTokenHandler = (
	provider: ProviderIdentity
) => Promise<string>;
