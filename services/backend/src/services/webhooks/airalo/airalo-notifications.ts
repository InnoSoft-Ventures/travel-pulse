import {
	Airalo,
	AiraloNotification,
	AiraloNotificationType,
} from '@travelpulse/providers';
import dbConnect from '../../../db';
import { providerTokenHandler } from '../../provider-token.service';
import { ProviderIdentity } from '@travelpulse/interfaces';
import { InternalException } from '@travelpulse/middlewares';

export const optingAiraloService = async (
	type: 'opt-in' | 'opt-out' | 'notification-details' | 'simulator',
	data: AiraloNotification | AiraloNotificationType
) => {
	const transact = await dbConnect.transaction();

	try {
		const token = await providerTokenHandler(transact)(
			ProviderIdentity.AIRALO
		);
		const airalo = Airalo.getInstance(token);
		let result;
		switch (type) {
			case 'opt-in':
				result = await airalo.optIn(data as AiraloNotification);
				break;
			case 'opt-out':
				result = await airalo.optOut(data as AiraloNotificationType);
				break;
			case 'notification-details':
				result = await airalo.notificationDetails();
				break;
			case 'simulator':
				result = await airalo.simulator(data as AiraloNotification);
				break;
			default:
				throw new Error('Unknown notification type');
		}

		await transact.commit();

		return result;
	} catch (error) {
		await transact.rollback();

		console.error('Error during opt-in:', error);

		throw new InternalException('Failed to opt-in', null);
	}
};
