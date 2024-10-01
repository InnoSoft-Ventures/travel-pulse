import { AiraloBase } from "./base";
import {
	AiraloNotification,
	AiraloOrderRequest,
	AiraloOrderResponse,
	AiraloPackageResponse,
} from "./types";
import { AxiosError } from "@libs/api-service";
import { AIRALO_API_URL } from "../config";

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
		type: "local" | "global",
		page: number,
		limit = 50,
		country?: string,
	) {
		try {
			const URL = `${AIRALO_API_URL}/packages`;
			const response = await this.request.get<AiraloPackageResponse>(URL, {
				params: {
					page,
					"filter[type]": type,
					limit,
					"filter[country]": country,
				},
			});

			if (response.status !== 200) {
				throw new Error("Failed to retrieve packages from response");
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
				console.error("Failed to fetch packages:", error.name);
			} else if (error instanceof Error) {
				console.error("Error:", error.message);
			}

			throw new Error("Unable to retrieve packages from Airalo API");
		}
	}

	/**
	 * Opt-in to Airalo notifications
	 */
	public async optIn(data: AiraloNotification) {
		try {
			const response = await this.request.post(
				`${AIRALO_API_URL}/notifications/opt-in`,
				data,
			);

			return response.data;
		} catch (error) {
			console.error("Failed to opt-in:", error);
			throw new Error("Unable to opt-in from Airalo API");
		}
	}

	public async orderPackage(data: AiraloOrderRequest) {
		try {
			const description = `${data.quantity} x ${data.type} - ${data.description}`;

			// Call the service to process the order
			const response = await this.request.post<AiraloOrderResponse>(
				`${AIRALO_API_URL}/orders-async`,
				{
					package_id: data.packageId,
					quantity: data.quantity,
					type: data.type,
					description: description,
				},
			);

			return response.data;
		} catch (error) {
			console.error("Airalo API: Failed to order package:", error);
			throw new Error("Unable to order package from Airalo API");
		}
	}
}
