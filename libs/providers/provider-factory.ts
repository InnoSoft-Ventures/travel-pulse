import { PackageType, ProviderIdentity } from "@libs/interfaces";
import { Airalo } from "./airalo";
import { BadRequestException } from "../middlewares";

export interface ProviderFactoryData {
	packageId: string;
	provider: ProviderIdentity;
	quantity: number;
	type: PackageType.SIM;
	startDate: string;
	dataAmount: number;
	voice: number;
	text: number;
}

interface ProviderOrderResponse {
	externalRequestId: string;
	provider: ProviderIdentity;
	dataAmount: number;
	voice: number;
	text: number;
}

export class ProviderFactory {
	private data: ProviderFactoryData[];

	constructor(data: ProviderFactoryData[]) {
		this.data = data;
	}

	private async airaloProvider(
		data: ProviderFactoryData,
	): Promise<ProviderOrderResponse> {
		console.log("Processing item for Airalo");

		const instance = Airalo.getInstance();

		try {
			const response = await instance.createOrder({
				quantity: data.quantity,
				packageId: data.packageId,
				type: data.type,
			});

			if (!response.data) {
				console.error("Error from Airalo", response.error);
				throw new Error("Error from Airalo");
			}

			return {
				externalRequestId: response.data.request_id,
				provider: ProviderIdentity.AIRALO,
				dataAmount: data.dataAmount,
				voice: data.voice,
				text: data.text,
			};
		} catch (error) {
			throw new BadRequestException(
				`Failed to complete order for Airalo: ${error}`,
				error,
			);
		}
	}

	private getProviderFunction(
		provider: ProviderIdentity,
	): (data: ProviderFactoryData) => Promise<ProviderOrderResponse> {
		switch (provider) {
			case ProviderIdentity.AIRALO:
				return this.airaloProvider;
			// Add other providers here as needed
			default:
				throw new BadRequestException(
					`Unsupported provider: ${provider}`,
					null,
				);
		}
	}

	async processOrder(): Promise<ProviderOrderResponse[]> {
		console.log("Processing order", this.data);

		// Process all provider orders concurrently
		const providerOrderPromises = this.data.map(async (item) => {
			const providerFunction = this.getProviderFunction(item.provider);

			return providerFunction.call(this, item);
		});

		try {
			const providerOrderResponses = await Promise.all(providerOrderPromises);
			console.log("Order processed", providerOrderResponses);

			return providerOrderResponses;
		} catch (error) {
			console.error("Error processing order:", error);
			throw error;
		}
	}
}
