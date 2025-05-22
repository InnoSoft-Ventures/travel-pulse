import { AIRALO_ACCESS_TOKEN } from '../config';
import { APIRequest } from '@travelpulse/api-service';

export class AiraloBase {
	private token: string = '';
	public request: typeof APIRequest;

	public constructor() {
		this.request = APIRequest;

		if (!AIRALO_ACCESS_TOKEN) {
			throw new Error('Airalo API token is missing');
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
}
