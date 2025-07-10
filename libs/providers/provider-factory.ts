import {
	ProviderFactoryData,
	ProviderIdentity,
	ProviderOrderResponse,
	ProviderStrategy,
	ProviderTokenHandler,
} from '@travelpulse/interfaces';
import { Airalo } from './data-providers/airalo';
import { BadRequestException } from '../middlewares';

export class ProviderFactory {
	private data: ProviderFactoryData[];
	private tokenHandler: ProviderTokenHandler;

	constructor(
		data: ProviderFactoryData[],
		tokenHandler: ProviderTokenHandler
	) {
		this.data = data;
		this.tokenHandler = tokenHandler;
	}

	private async resolveStrategy(
		provider: ProviderIdentity
	): Promise<ProviderStrategy> {
		const token = await this.tokenHandler(provider);

		switch (provider) {
			case ProviderIdentity.AIRALO:
				return Airalo.getInstance(token);
			// future:
			// case ProviderIdentity.ESIM_ACCESS:
			//   return EsimAccess.getInstance(token);
			default:
				throw new BadRequestException(
					`Unsupported provider: ${provider}`,
					null
				);
		}
	}

	async processOrder(): Promise<ProviderOrderResponse[]> {
		console.log('Processing order', this.data);

		// Process all provider orders concurrently
		try {
			const providerOrderPromises = this.data.map(async (item) => {
				const strategy = await this.resolveStrategy(item.provider);
				return strategy.createOrder(item);
			});

			const providerOrderResponses = await Promise.all(
				providerOrderPromises
			);
			console.log('Order processed', providerOrderResponses);

			return providerOrderResponses;
		} catch (error) {
			console.error('Error processing order:', error);
			throw error;
		}
	}
}
