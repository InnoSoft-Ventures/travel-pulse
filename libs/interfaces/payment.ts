import { PaymentStatus } from './enums';

export const PAYMENT_METHODS = {
	stripe: ['card', 'apple_pay', 'google_pay'],
	paypal: ['card', 'paypal'],
} as const;

export type PaymentProviders = typeof PAYMENT_METHODS;
export type PaymentProvider = keyof PaymentProviders;
export type PaymentMethod<P extends PaymentProvider = PaymentProvider> =
	PaymentProviders[P][number];

export type ProviderMethodPair = {
	[P in PaymentProvider]: { provider: P; method: PaymentMethod<P> };
}[PaymentProvider];

export type PaymentAttempt = ProviderMethodPair & {
	attemptId: number;
	status: PaymentStatus;
	amount: number;
	currency: string;
};
