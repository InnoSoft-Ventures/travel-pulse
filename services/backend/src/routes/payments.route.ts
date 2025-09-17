import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import { PaymentAttemptSchema } from '@travelpulse/interfaces/schemas/payment.schema';
import { createPaymentAttempt } from '../controllers/payment.controller';

const router = express.Router();

router.post(
	'/',
	validateData(PaymentAttemptSchema),
	errorHandler(createPaymentAttempt)
);

export default router;
