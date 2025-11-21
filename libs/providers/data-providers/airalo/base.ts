import { RequestService } from '@travelpulse/api-service';

export class AiraloBase {
	private token: string = '';
	public request: ReturnType<typeof RequestService>;

	public constructor(accessToken: string) {
		if (!accessToken) {
			throw new Error('Airalo API token is missing');
		}

		this.request = RequestService();

		this.token = accessToken;

		// Set up the request interceptor to include the Authorization header
		this.request.interceptors.request.use((config) => {
			if (this.token) {
				config.headers.Authorization = `Bearer ${this.token}`;
			}
			return config;
		});
	}
}
