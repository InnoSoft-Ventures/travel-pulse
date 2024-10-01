import { PackageType, ProviderIdentity } from "@libs/interfaces";
import { Airalo } from "./airalo";
import { BadRequestException } from "../middlewares";

export interface ProviderFactoryData {
	packageId: string;
	provider: ProviderIdentity;
	quantity: number;
	type: PackageType.SIM;
	startDate: string;
}

interface ProviderOrderResponse {
	externalRequestId: string;
	provider: ProviderIdentity;
}

export class ProviderFactory {
	private data: ProviderFactoryData[];
	private orderId: number;

	constructor(data: ProviderFactoryData[], orderId: number) {
		this.data = data;
		this.orderId = orderId;
	}

	private async airaloProvider(
		data: ProviderFactoryData,
	): Promise<ProviderOrderResponse> {
		console.log("Processing item for Airalo");

		const instance = Airalo.getInstance();

		const response = await instance.createOrder({
			quantity: data.quantity,
			packageId: data.packageId,
			type: data.type,
		});

		if (!response.data) {
			throw new BadRequestException(
				"Failed to complete order:",
				response.error,
			);
		}

		return {
			externalRequestId: response.data.request_id,
			provider: ProviderIdentity.AIRALO,
		};
	}

	async processOrder() {
		// Process order
		console.log("Processing order");
		console.log(this.orderId, this.data);

		const providerOrderResponse: ProviderOrderResponse[] = [];

		for (const item of this.data) {
			if (item.provider === ProviderIdentity.AIRALO) {
				const airaloOrder = await this.airaloProvider(item);

				providerOrderResponse.push(airaloOrder);
			}
		}

		console.log("Order processed", providerOrderResponse);
		return providerOrderResponse;
	}
}
