import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import {
	getOrders,
	getOrderById,
	makeOrder,
} from '../controllers/orders.controller';
import { OrderPayloadSchema } from '@travelpulse/interfaces/schemas';
import { createPaymentAttempt } from '../controllers/payment.controller';
import { PaymentAttemptSchema } from '@travelpulse/interfaces/schemas';

const router = express.Router();

router.get('/', errorHandler(getOrders));
router.get('/:orderId', errorHandler(getOrderById));

router.post('/', validateData(OrderPayloadSchema), errorHandler(makeOrder));
router.post(
	'/:orderId/payments',
	validateData(PaymentAttemptSchema),
	errorHandler(createPaymentAttempt)
);

export default router;
