import { RequestService } from '@travelpulse/api-service';
import { ProviderIdentity } from '@travelpulse/interfaces';

export interface ProviderAuthCredentials {
	clientId: string;
	clientSecret: string;
	grantType: string;
}

export class ProviderAuthenticate {
	private request: ReturnType<typeof RequestService>;
	private static instance: ProviderAuthenticate;

	constructor() {
		this.request = RequestService();
	}

	// Singleton Pattern - ensures only one instance is created
	public static getInstance(): ProviderAuthenticate {
		if (!ProviderAuthenticate.instance) {
			ProviderAuthenticate.instance = new ProviderAuthenticate();
		}
		return ProviderAuthenticate.instance;
	}

	/**
	 * Authenticate with the API to obtain the token
	 */
	public async authenticate<T>(
		provider: ProviderIdentity,
		apiURL: string,
		info: ProviderAuthCredentials
	): Promise<T> {
		const data = {
			client_id: info.clientId,
			client_secret: info.clientSecret,
			grant_type: info.grantType,
		};

		try {
			const response = await this.request.post<T>(apiURL, data);

			if (response.status !== 200) {
				console.error('Error:', response.data);

				throw new Error(
					'Failed to retrieve access token from response'
				);
			}

			return response.data;
		} catch (error) {
			console.error('Authentication failed:', error);
			throw new Error(`Unable to authenticate with "${provider}" API`);
		}
	}
}
