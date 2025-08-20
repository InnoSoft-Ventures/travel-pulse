import { Response } from 'express';
import { SessionRequest } from '../../types/express';
import { createPaymentAttemptService } from '../services/payments/payment.service';
import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';
import { confirmPaymentService } from '../services/payments/confirm-payment.service';

export const createPaymentAttempt = async (
	req: SessionRequest,
	res: Response
) => {
	const paymentAttempt = await createPaymentAttemptService(req);

	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(paymentAttempt, 'Payment attempt created')
	);
};

export const confirmPayment = async (req: SessionRequest, res: Response) => {
	const processed = await confirmPaymentService(req);

	// For now, we can return a success response
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(processed, 'Payment confirmed successfully')
	);
};
