import { AiraloBase } from './base';
import {
	AiraloNotification,
	AiraloNotificationType,
	AiraloOrderRequest,
	AiraloOrderResponse,
	AiraloPackageResponse,
} from './types';
import { AxiosError } from '@travelpulse/api-service';
import {
	ProviderFactoryData,
	ProviderOrderResponse,
	ProviderStrategy,
	SOMETHING_WENT_WRONG,
} from '@travelpulse/interfaces';

import { AIRALO_API_URL } from '../../config';
import { orderMetaUtil } from '../../util';

export class Airalo extends AiraloBase implements ProviderStrategy {
	private static instance: Airalo;

	private constructor(accessToken: string) {
		super(accessToken);
	}

	// Singleton Pattern - ensures only one instance is created
	public static getInstance(accessToken: string): Airalo {
		if (!Airalo.instance) {
			Airalo.instance = new Airalo(accessToken);
		}
		return Airalo.instance;
	}

	// Fetch available packages
	public async getPackages(
		type: 'local' | 'global',
		page: number,
		limit = 50,
		country?: string
	) {
		try {
			const URL = `${AIRALO_API_URL}/packages`;
			const response = await this.request.get<AiraloPackageResponse>(
				URL,
				{
					params: {
						page,
						'filter[type]': type,
						limit,
						'filter[country]': country,
					},
				}
			);

			if (response.status !== 200) {
				console.error('Error:', response.data);
				throw new Error('Failed to retrieve packages from response');
			}

			const packages = response.data.data.map((pkg) => {
				return {
					slug: pkg.slug,
					country_code: pkg.country_code,
					title: pkg.title,
					operators: pkg.operators.map((operator) => {
						delete operator.image;

						return {
							...operator,
							packages: operator.packages,
							countries: operator.countries.map((country) => {
								return {
									title: country.title,
									country_code: country.country_code,
								};
							}),
						};
					}),
				};
			});

			return {
				packages,
				meta: {
					current_page: response.data.meta.current_page,
					last_page: response.data.meta.last_page,
					total: response.data.meta.total,
					prev: !!response.data.links.prev,
					next: !!response.data.links.next,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Failed to fetch packages:', error.name);
			} else if (error instanceof Error) {
				console.error('Error:', error.message);
			}

			throw new Error('Unable to retrieve packages from Airalo API');
		}
	}

	/**
	 * Opt-in for Airalo notifications.
	 *
	 * @param data - The Airalo notification data.
	 * @returns The response data from the Airalo API.
	 * @throws Error if unable to opt-in from Airalo API.
	 */
	public async optIn(data: AiraloNotification) {
		try {
			const response = await this.request.post(
				`${AIRALO_API_URL}/notifications/opt-in`,
				data
			);

			return response.data;
		} catch (error) {
			console.error('Failed to opt-in:', error);
			throw new Error('Unable to opt-in from Airalo API');
		}
	}

	/**
	 * Opt-out for Airalo notifications.
	 *
	 * @param type - The type of notification to opt-out from.
	 * @returns The response data from the Airalo API.
	 * @throws Error if unable to opt-in from Airalo API.
	 */
	public async optOut(type: AiraloNotificationType) {
		try {
			const response = await this.request.post(
				`${AIRALO_API_URL}/notifications/opt-out`,
				{
					type,
				}
			);

			console.log('Opt-out:', type, response.data);

			return response.data;
		} catch (error) {
			console.error('Failed to opt-out:', error);
			throw new Error('Unable to opt-out from Airalo API');
		}
	}

	/**
	 * Retrieves notification details from Airalo.
	 *
	 * @param data - The Airalo notification data.
	 * @returns The response data from the Airalo API.
	 * @throws Error if unable to retrieve notification details from Airalo API.
	 */
	public async notificationDetails() {
		try {
			const response = await this.request.get(
				`${AIRALO_API_URL}/notifications/opt-in`
			);

			return response.data;
		} catch (error) {
			console.error('Failed to retrieve notification details:', error);
			throw new Error(
				'Unable to retrieve notification details from Airalo API'
			);
		}
	}

	/**
	 * Retrieves the Airalo simulator details.
	 *
	 * @param data - The Airalo simulator data.
	 * @returns The response data from the Airalo API.
	 * @throws Error if unable to retrieve simulator details from Airalo API.
	 */
	public async simulator(data: AiraloNotification) {
		try {
			const response = await this.request.post(
				`${AIRALO_API_URL}/simulator/webhook`,
				data
			);

			return response.data;
		} catch (error) {
			console.error('Failed to retrieve simulator details:', error);
			throw new Error(
				'Unable to retrieve simulator details from Airalo API'
			);
		}
	}

	/**
	 * Retrieves the eSIM usage details for a specific SIM card.
	 *
	 * @param iccid - The ICCID of the SIM card.
	 * @returns The eSIM usage details.
	 */
	public async getESIMUsage(iccid: string) {
		try {
			const response = await this.request.get(
				`${AIRALO_API_URL}/sims/${iccid}/usage`
			);

			return response.data;
		} catch (error) {
			console.error('Failed to retrieve eSIM usage:', error);
			throw new Error('Unable to retrieve eSIM usage from Airalo API');
		}
	}

	/**
	 * Creates an order for a package from Airalo.
	 *
	 * @param data - The data required to create the order.
	 * @returns The response data containing the order details.
	 * @throws An error if the order creation fails.
	 */
	private async createAiraloOrder(data: AiraloOrderRequest) {
		try {
			let WEBHOOK_URL = process.env.WEBHOOK_BASE_URL || '';

			if (WEBHOOK_URL) {
				WEBHOOK_URL += '/airalo/orders';
			}

			// Call the service to process the order
			const response = await this.request.post<AiraloOrderResponse>(
				`${AIRALO_API_URL}/orders-async`,
				{
					package_id: data.packageId,
					quantity: data.quantity,
					type: data.type,
					description: data.description,
					webhook_url: WEBHOOK_URL,
				}
			);

			if (response.status === 202) {
				return { success: true, data: response.data.data };
			}

			console.log('Airalo Order Error:', response.data);

			return { success: false, error: response.data };
		} catch (error) {
			console.error('Airalo API: Failed to order package:', error);

			return { success: false, error: SOMETHING_WENT_WRONG };
		}
	}

	public async createOrder(
		data: ProviderFactoryData
	): Promise<ProviderOrderResponse> {
		console.log('Processing item for Airalo');

		const description = orderMetaUtil(data);

		const response = await this.createAiraloOrder({
			quantity: data.quantity,
			packageId: data.packageId,
			type: data.type,
			description,
		});

		if (!response.success || !response.data) {
			console.error('Error from Airalo', response.error);
			throw new Error('Error from Airalo');
		}

		return {
			...data,
			externalRequestId: response.data.request_id,
		};
	}
}
