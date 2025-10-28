import { Transaction } from 'sequelize';
import PaymentCard, {
	PaymentCardCreationAttributes,
} from '../../db/models/PaymentCard';
import { PaymentMethodEnum, PaymentCardPayload } from '@travelpulse/interfaces';
import { BadRequestException } from '@travelpulse/middlewares';
import dbConnect from '../../db';

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

export async function getUserPaymentCards(
	userId: number
): Promise<PaymentCardPayload[]> {
	const cards = await PaymentCard.findAll({
		where: { userId, provider: PaymentMethodEnum.paystack },
		order: [
			['default', 'DESC'],
			['createdAt', 'DESC'],
		],
	});

	return cards.map((card) => ({
		id: card.id,
		cardName: card.accountName,
		isDefault: card.default,
		last4: card.last4 || '',
		expMonth: card.expMonth || 0,
		expYear: card.expYear || 0,
		brand: card.brand as PaymentCardPayload['brand'],
		createdAt: card.createdAt.toISOString(),
	}));
}

export async function setDefaultPaymentCard(
	userId: number,
	cardId: number,
	transact: Transaction
) {
	// Unset previous default cards
	await PaymentCard.update(
		{ default: false },
		{ where: { userId, default: true }, transaction: transact }
	);

	// Set new default card
	await PaymentCard.update(
		{ default: true },
		{ where: { id: cardId, userId }, transaction: transact }
	);
}

/**
 * Deletes a payment card for a user only if there is at least one other card remaining.
 * @param userId
 * @param cardId
 * @param transact
 */
export async function deletePaymentCard(userId: number, cardId: number) {
	const userCardsCount = await PaymentCard.count({ where: { userId } });

	if (userCardsCount <= 1) {
		throw new BadRequestException(
			'Cannot delete the only saved payment card.',
			null
		);
	}

	await PaymentCard.destroy({
		where: { id: cardId, userId },
	});
}

export async function markPaymentCardAsDefault(userId: number, cardId: number) {
	const transact = await dbConnect.transaction();

	try {
		// Unset previous default cards
		await PaymentCard.update(
			{ default: false },
			{ where: { userId, default: true }, transaction: transact }
		);

		// Set new default card
		await PaymentCard.update(
			{ default: true },
			{ where: { id: cardId, userId }, transaction: transact }
		);

		await transact.commit();
	} catch (error) {
		await transact.rollback();

		throw error;
	}
}
