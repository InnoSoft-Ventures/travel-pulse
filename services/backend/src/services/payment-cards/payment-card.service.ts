import { Op, Transaction } from 'sequelize';
import PaymentCard, {
	PaymentCardCreationAttributes,
} from '../../db/models/PaymentCard';
import { PaymentMethodEnum, PaymentCardPayload } from '@travelpulse/interfaces';
import { BadRequestException } from '@travelpulse/middlewares';
import dbConnect from '../../db';

export async function saveCardDetails(
	cardDetails: PaymentCardCreationAttributes,
	transaction: Transaction
) {
	if (!cardDetails?.reusable) return;

	const identity = {
		userId: cardDetails.userId,
		provider: cardDetails.provider,
		last4: cardDetails.last4,
		signature: cardDetails.signature ?? null,
	};

	// Step 1: get or create the card
	const [card, created] = await PaymentCard.findOrCreate({
		where: identity,
		defaults: cardDetails,
		transaction,
	});

	// Prepare fields we actually want to update (avoid mutating identity)
	const { userId, provider, last4, signature, ...updatable } = cardDetails;

	// Step 2: handle default logic AFTER we know the card id
	if (cardDetails.default) {
		// Clear default only on *other* cards
		await PaymentCard.update(
			{ default: false },
			{
				where: {
					userId: cardDetails.userId,
					id: { [Op.ne]: card.id },
					default: true,
				},
				transaction,
			}
		);

		// Ensure this card is default
		updatable.default = true;
	}

	// Step 3: update existing card if needed
	if (!created) {
		await card.update(updatable, { transaction });
	}
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
