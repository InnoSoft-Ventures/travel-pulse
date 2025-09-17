export const PAYMENT_METHODS = {
	payfast: ['card', 'apple_pay', 'google_pay'],
	paypal: ['card', 'paypal'],
} as const;

export type PaymentProviders = typeof PAYMENT_METHODS;
export type PaymentProvider = keyof PaymentProviders;
export type PaymentMethod<P extends PaymentProvider = PaymentProvider> =
	PaymentProviders[P][number];

export type ProviderMethodPair = {
	[P in PaymentProvider]: { provider: P; method: PaymentMethod<P> };
}[PaymentProvider];
