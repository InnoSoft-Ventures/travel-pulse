import { AiraloBase } from './base';
import {
	AiraloNotification,
	AiraloOrderRequest,
	AiraloOrderResponse,
	AiraloPackageResponse,
} from './types';
import { APIRequest, AxiosError } from '@travelpulse/api-service';
import { SOMETHING_WENT_WRONG } from '@travelpulse/interfaces';

import { AiraloAccessToken } from './types';
import {
	AIRALO_API_URL,
	AIRALO_CLIENT_ID,
	AIRALO_CLIENT_SECRET,
	AIRALO_GRANT_TYPE,
} from '../config';

export class Airalo extends AiraloBase {
	private static instance: Airalo;

	private constructor() {
		super();
	}

	// Singleton Pattern - ensures only one instance is created
	public static getInstance(): Airalo {
		if (!Airalo.instance) {
			Airalo.instance = new Airalo();
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
	 * Creates an order for a package from Airalo.
	 *
	 * @param data - The data required to create the order.
	 * @returns The response data containing the order details.
	 * @throws An error if the order creation fails.
	 */
	public async createOrder(data: AiraloOrderRequest) {
		try {
			const description = `${data.quantity} x ${data.type} - ${data.packageId}`;

			// Call the service to process the order
			const response = await this.request.post<AiraloOrderResponse>(
				`${AIRALO_API_URL}/orders-async`,
				{
					package_id: data.packageId,
					quantity: data.quantity,
					type: data.type,
					description: description,
				}
			);

			if (response.status === 202) {
				return { success: true, data: response.data.data };
			}

			console.log('Airalo Order Error:', response.data.data);

			return { success: false, error: response.data.data };
		} catch (error) {
			console.error('Airalo API: Failed to order package:', error);

			return { success: false, error: SOMETHING_WENT_WRONG };
		}
	}
}

export class AiraloAuthenticated {
	private request: typeof APIRequest;
	private static instance: AiraloAuthenticated;

	constructor() {
		this.request = APIRequest;
	}

	// Singleton Pattern - ensures only one instance is created
	public static getInstance(): AiraloAuthenticated {
		if (!AiraloAuthenticated.instance) {
			AiraloAuthenticated.instance = new AiraloAuthenticated();
		}
		return AiraloAuthenticated.instance;
	}

	/**
	 * Authenticate with the API to obtain the token
	 */
	public async authenticate(): Promise<AiraloAccessToken['data']> {
		const URL = `${AIRALO_API_URL}/token`;
		const data = {
			client_id: AIRALO_CLIENT_ID,
			client_secret: AIRALO_CLIENT_SECRET,
			grant_type: AIRALO_GRANT_TYPE,
		};

		try {
			const response = await this.request.post<AiraloAccessToken>(
				URL,
				data
			);

			if (response.status !== 200) {
				throw new Error(
					'Failed to retrieve access token from response'
				);
			}

			return response.data.data;
		} catch (error) {
			console.error('Authentication failed:', error);
			throw new Error('Unable to authenticate with Airalo API');
		}
	}
}
