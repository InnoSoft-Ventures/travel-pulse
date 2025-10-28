import { Response } from 'express';
import {
	deletePaymentCard,
	getUserPaymentCards,
	markPaymentCardAsDefault,
} from '../services/payment-cards/payment-card.service';
import { SessionRequest } from '../../types/express';
import { successResponse } from '@travelpulse/middlewares';

export const getCards = async (req: SessionRequest, res: Response) => {
	const cards = await getUserPaymentCards(req.user.accountId);

	res.json(successResponse(cards));
};

export const deleteCard = async (req: SessionRequest, res: Response) => {
	const cardId = Number(req.params.cardId);

	await deletePaymentCard(req.user.accountId, cardId);

	res.json(successResponse({}, 'Card removed successfully.'));
};

export const markDefaultCard = async (req: SessionRequest, res: Response) => {
	const cardId = Number(req.params.cardId);

	await markPaymentCardAsDefault(req.user.accountId, cardId);

	res.json(successResponse({}, 'Card marked as default successfully.'));
};
