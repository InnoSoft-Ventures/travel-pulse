import { ProviderFactoryData } from '@travelpulse/interfaces';
import { ProviderFactory } from '@travelpulse/providers';
import { Transaction } from 'sequelize';
import ProviderOrder from '../../db/models/ProviderOrder';
import { providerTokenHandler } from '../provider-token.service';

/**
 * Process provider orders
 * @param providerOrderDataPreparation
 * @param orderId
 * @param transact
 */
export const processProviderOrders = async (
	providerOrderDataPreparation: ProviderFactoryData[],
	orderId: number,
	currency: string,
	transact: Transaction
) => {
	console.log('Processing provider orders');

	const provider = new ProviderFactory(
		providerOrderDataPreparation,
		providerTokenHandler(transact)
	);
	const providerOrders = await provider.processOrder();

	const providerOrderList = providerOrders.map((item) => ({
		...item,
		orderId,
		currency,
	}));

	await ProviderOrder.bulkCreate(providerOrderList, {
		transaction: transact,
	});

	console.log('Provider orders processed');
};
