import { initPaystackOneTimePayment } from './one-time.payment';
import { OneTimePaymentContext, PaymentProviderAdapter } from '../types';

export class PaystackAdapter implements PaymentProviderAdapter {
	public readonly name = 'paystack';
	private apiUrl = '';
	private secretKey = '';

	constructor() {
		this.apiUrl = process.env.PAYSTACK_API_URL || '';

		if (process.env.SERVER_ENV === 'production') {
			this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
		} else {
			this.secretKey = process.env.PAYSTACK_TEST_SECRET_KEY || '';
		}

		if (!this.secretKey) {
			throw new Error('PAYSTACK_SECRET_KEY not configured');
		}

		if (!this.apiUrl) {
			throw new Error('PAYSTACK_API_URL not configured');
		}
	}

	private getSecretKey() {
		if (process.env.SERVER_ENV === 'production') {
			this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
		} else {
			this.secretKey = process.env.PAYSTACK_TEST_SECRET_KEY || '';
		}

		return this.secretKey;
	}

	async initOneTimePayment(ctx: OneTimePaymentContext) {
		const ps = await initPaystackOneTimePayment(
			{
				email: ctx.email,
				amount: ctx.order.totalAmount,
				currency: ctx.currency,
				channels: ['card'],
				metadata: {
					orderId: ctx.order.orderId,
					userId: ctx.userId,
					paymentAttemptId: ctx.paymentAttemptId,
					orderNumber: ctx.order.orderNumber,
				},
			},
			this.getSecretKey(),
			this.apiUrl
		);

		return {
			providerReference: ps.reference,
			redirectUrl: ps.authorizationUrl,
			metadata: { accessCode: ps.accessCode },
		};
	}
}
