import { AiraloAccessToken } from "./types";
import {
	AIRALO_ACCESS_TOKEN,
	AIRALO_API_URL,
	AIRALO_CLIENT_ID,
	AIRALO_CLIENT_SECRET,
	AIRALO_GRANT_TYPE,
} from "./../config";
import { APIRequest } from "@libs/api-service";

export class AiraloBase {
	private token: string = "";
	public request: typeof APIRequest;

	public constructor() {
		this.request = APIRequest;

		if (!AIRALO_ACCESS_TOKEN) {
			throw new Error("Airalo API token is missing");
		}

		this.token = AIRALO_ACCESS_TOKEN;

		// Set up the request interceptor to include the Authorization header
		this.request.interceptors.request.use((config) => {
			if (this.token) {
				config.headers.Authorization = `Bearer ${this.token}`;
			}
			return config;
		});
	}

	/**
	 * Authenticate with the API to obtain the token
	 */
	public async authenticate(): Promise<AiraloAccessToken["data"]> {
		const URL = `${AIRALO_API_URL}/token`;
		const data = {
			client_id: AIRALO_CLIENT_ID,
			client_secret: AIRALO_CLIENT_SECRET,
			grant_type: AIRALO_GRANT_TYPE,
		};

		try {
			const response = await this.request.post<AiraloAccessToken>(URL, data);

			if (response.status !== 200) {
				throw new Error("Failed to retrieve access token from response");
			}

			return response.data.data;
		} catch (error) {
			console.error("Authentication failed:", error);
			throw new Error("Unable to authenticate with Airalo API");
		}
	}
}
