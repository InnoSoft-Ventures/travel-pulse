import { Transaction } from 'sequelize';
import PaymentCard, {
	PaymentCardCreationAttributes,
} from '../../db/models/PaymentCard';

export async function saveCardDetails(
	cardDetails: PaymentCardCreationAttributes,
	transact: Transaction
) {
	if (!cardDetails || !cardDetails.reusable) return;

	// Upsert by userId + provider + last4 (+exp if available)
	const [record] = await PaymentCard.findOrCreate({
		where: {
			userId: cardDetails.userId,
			provider: cardDetails.provider,
			last4: cardDetails.last4,
		},
		defaults: cardDetails as any,
		transaction: transact,
	});

	// Update changing fields (e.g., authorization code) if already exists
	await record.update(cardDetails, {
		transaction: transact,
	});
}
