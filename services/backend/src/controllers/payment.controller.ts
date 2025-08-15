import { Response } from 'express';
import { SessionRequest } from '../../types/express';
import { createPaymentAttemptService } from '../services/payments/payment.service';
import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';

export const createPaymentAttempt = async (
	req: SessionRequest,
	res: Response
) => {
	const paymentAttempt = await createPaymentAttemptService(req);

	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(paymentAttempt, 'Payment attempt created')
	);
};
