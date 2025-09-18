import express from 'express';
import {
	errorHandler,
	errorResponse,
	validateData,
} from '@travelpulse/middlewares';
import { getOrders, makeOrder } from '../controllers/orders.controller';
import { OrderPayloadSchema } from '@travelpulse/interfaces/schemas';
import {
	// confirmPayment,
	createPaymentAttempt,
} from '../controllers/payment.controller';
import {
	PaymentAttemptSchema,
	PaymentConfirmationRequestSchema,
} from '@travelpulse/interfaces/schemas';

const router = express.Router();

router.get('/', errorHandler(getOrders));

router.post('/', validateData(OrderPayloadSchema), errorHandler(makeOrder));
router.post(
	'/:orderId/payments',
	validateData(PaymentAttemptSchema),
	errorHandler(createPaymentAttempt)
);
// router.post(
// 	'/:orderId/payments/:paymentId/confirm',
// 	validateData(PaymentConfirmationRequestSchema),
// 	errorHandler(confirmPayment)
// );

router.post(
	'/:orderId/payments/:paymentId/confirm',
	validateData(PaymentConfirmationRequestSchema),
	errorHandler((_req: any, res: any) => {
		res.status(200).json(errorResponse('Fail'));
	})
);

export default router;
