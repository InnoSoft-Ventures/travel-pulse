import {
	chargePayStackReusableCard,
	initPaystackOneTimePayment,
} from './one-time.payment';
import {
	ChargePaymentCardContext,
	OneTimePaymentContext,
	PaymentProviderAdapter,
} from '../types';

export class PaystackAdapter implements PaymentProviderAdapter {
	public readonly name = 'paystack';
	private readonly apiUrl: string;
	private readonly secretKey: string;

	constructor() {
		this.apiUrl = process.env.PAYSTACK_API_URL || '';
		this.secretKey =
			process.env.SERVER_ENV === 'production'
				? process.env.PAYSTACK_SECRET_KEY || ''
				: process.env.PAYSTACK_TEST_SECRET_KEY || '';

		if (!this.secretKey) {
			throw new Error('PAYSTACK_SECRET_KEY not configured');
		}

		if (!this.apiUrl) {
			throw new Error('PAYSTACK_API_URL not configured');
		}
	}

	private getSecretKey() {
		return this.secretKey;
	}

	/**
	 * Initialize a one-time payment transaction.
	 * @link https://paystack.com/docs/api/transaction/#initialize
	 */
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
				reference: `tpay_${ctx.paymentAttemptId}_${Date.now()}`,
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

	/**
	 * Charge a saved payment card using authorization code.
	 * @link https://paystack.com/docs/api/transaction/#charge-authorization
	 */
	async chargePaymentCard(data: ChargePaymentCardContext) {
		const process = await chargePayStackReusableCard(
			{
				authorizationCode: data.authorizationCode,
				email: data.email,
				amount: data.order.totalAmount,
				currency: data.currency,
				channels: ['card'],
				metadata: {
					orderId: data.order.orderId,
					userId: data.userId,
					paymentAttemptId: data.paymentAttemptId,
				},
				reference: `tpay_${data.paymentAttemptId}_${Date.now()}`,
			},
			this.getSecretKey(),
			this.apiUrl
		);

		return {
			providerReference: process.reference,
		};
	}
}
