import { ProviderIdentity } from '@travelpulse/interfaces';
import Provider from '../db/models/Provider';
import { InternalException } from '@travelpulse/middlewares';
import { isTokenValid } from '../utils/date';
import {
	ProviderAccessToken,
	ProviderAuthenticate,
} from '@travelpulse/providers';
import { findProvider } from './provider.service';
import { Transaction } from 'sequelize';

/**
 * Fetch provider access token, check if still valid using expiry date,
 *  - If expired will use the clientId and clientSecret to obtain new access token then return it
 *  - Otherwise, will return current access token
 */
export function providerTokenHandler(transact: Transaction) {
	return async (provider: ProviderIdentity) => {
		const details = await findProvider(provider, transact);

		const isValid = isTokenValid(details.createdAt, details.expiresIn);

		if (isValid) return details.accessToken;

		const apiUrl = `${getProviderURL(provider)}/token`;

		return await authenticateProviderService(
			provider,
			apiUrl,
			transact,
			details
		);
	};
}

export async function authenticateProviderService(
	provider: ProviderIdentity,
	apiUrl: string,
	transact: Transaction,
	providerDetails?: Provider
): Promise<string> {
	const auth = ProviderAuthenticate.getInstance();

	const providerInfo =
		providerDetails ?? (await findProvider(provider, transact));

	const response = await auth.authenticate<ProviderAccessToken>(
		provider,
		apiUrl,
		{
			clientId: providerInfo.clientId,
			clientSecret: providerInfo.clientSecret,
			grantType: providerInfo.grantType,
		}
	);

	if (!response) {
		throw new InternalException(
			`Failed to authenticate with ${provider}`,
			{}
		);
	}

	const { access_token, expires_in, token_type } = response.data;

	await Provider.upsert(
		{
			name: provider,
			identityName: provider.toLowerCase() as ProviderIdentity,
			accessToken: access_token,
			expiresIn: expires_in,
			tokenType: token_type,
			issuedAt: new Date(),
		},
		{
			transaction: transact,
		}
	);

	return access_token;
}

export function getProviderURL(provider: ProviderIdentity): string {
	switch (provider) {
		case ProviderIdentity.AIRALO:
			return process.env.AIRALO_API_URL || '';
		// case ProviderIdentity.ESIM_ACCESS:
		// 	return ESIM_ACCESS_API_URL;
		default:
			throw new Error(`URL not configured for provider: ${provider}`);
	}
}
