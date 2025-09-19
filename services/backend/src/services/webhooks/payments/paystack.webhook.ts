import { Request } from 'express';
import crypto from 'crypto';
import { PaystackWebhookPayload } from '@travelpulse/interfaces';
import { handleChargeSuccess } from './charge-handler';

const verifyPaystackSignature = (req: Request) => {
	const secret = process.env.PAYSTACK_TEST_SECRET_KEY || '';
	const hash = crypto
		.createHmac('sha512', secret)
		.update(JSON.stringify(req.body))
		.digest('hex');

	return hash == req.headers['x-paystack-signature'];
};

export const handlePaystackWebhook = async (req: Request) => {
	if (!verifyPaystackSignature(req)) {
		throw new Error('Invalid Paystack signature');
	}

	const { event, data } = req.body as PaystackWebhookPayload;

	switch (event) {
		case 'charge.success':
			handleChargeSuccess(data);
			break;

		default:
			break;
	}

	return true;
};
