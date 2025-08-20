import { ProviderIdentity } from '@travelpulse/interfaces';
import Provider from '../db/models/Provider';
import { BadRequestException } from '@travelpulse/middlewares';
import { Transaction } from 'sequelize';

export async function findProvider(
	provider: ProviderIdentity,
	transact: Transaction
) {
	const providerDetails = await Provider.findOne({
		where: {
			identityName: provider.toLowerCase() as ProviderIdentity,
			enabled: true, // Ensure the provider is enabled
		},
		transaction: transact,
	});

	if (!providerDetails) {
		throw new BadRequestException("Specified provider doesn't exist", null);
	}

	// Ensure clientId and clientSecret are set
	if (!providerDetails.clientId || !providerDetails.clientSecret) {
		throw new BadRequestException(
			`Provider ${provider} is not configured properly. Please set clientId and clientSecret.`,
			null
		);
	}

	return providerDetails;
}
