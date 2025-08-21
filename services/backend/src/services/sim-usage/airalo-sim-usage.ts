import { Airalo } from '@travelpulse/providers';
import { providerTokenHandler } from '../provider-token.service';
import dbConnect from '../../db';
import { ProviderIdentity } from '@travelpulse/interfaces';

export const getAiraloESIMUsageService = async (simICCID: string) => {
	const transact = await dbConnect.transaction();

	try {
		const token = await providerTokenHandler(transact)(
			ProviderIdentity.AIRALO
		);
		const airalo = Airalo.getInstance(token);

		return airalo.getESIMUsage(simICCID);
	} catch (error) {
		console.error('Error retrieving eSIM usage:', error);
		throw new Error('Unable to retrieve eSIM usage from Airalo API');
	}
};
