import { PaymentProvider } from '@travelpulse/interfaces';

export interface OneTimePaymentContext {
	order: {
		orderId: number;
		totalAmount: number;
		orderNumber?: string;
	};
	userId: number;
	currency: string;
	paymentAttemptId: number;
	method: string;
	email: string;
}

export interface ChargePaymentCardContext
	extends Omit<OneTimePaymentContext, 'method'> {
	authorizationCode: string;
}

export interface ProviderSessionData {
	providerReference?: string;
	redirectUrl?: string;
	metadata?: Record<string, any>;
}

export interface PaymentProviderAdapter {
	readonly name: PaymentProvider | string;
	initOneTimePayment?(
		ctx: OneTimePaymentContext
	): Promise<ProviderSessionData | undefined>;
	chargePaymentCard?(
		data: ChargePaymentCardContext
	): Promise<
		Omit<ProviderSessionData, 'redirectUrl' | 'metadata'> | undefined
	>;
	// Future: initSubscriptionPayment?, refund?, etc.
}
