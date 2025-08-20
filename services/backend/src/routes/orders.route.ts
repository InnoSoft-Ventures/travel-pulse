import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import { getOrders, makeOrder } from '../controllers/orders.controller';
import { OrderPayloadSchema } from '../schema/order.schema';
import {
	confirmPayment,
	createPaymentAttempt,
} from '../controllers/payment.controller';
import {
	PaymentAttemptSchema,
	PaymentConfirmationRequestSchema,
} from '../schema/payment.schema';

const router = express.Router();

router.get('/', errorHandler(getOrders));

router.post('/', validateData(OrderPayloadSchema), errorHandler(makeOrder));
router.post(
	'/:orderId/payments',
	validateData(PaymentAttemptSchema),
	errorHandler(createPaymentAttempt)
);
router.post(
	'/:orderId/payments/:paymentId/confirm',
	validateData(PaymentConfirmationRequestSchema),
	errorHandler(confirmPayment)
);

export default router;
