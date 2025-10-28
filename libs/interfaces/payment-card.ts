export interface PaymentCardPayload {
	id: number;
	cardName: string | null;
	isDefault: boolean;
	last4: string;
	expMonth: number;
	expYear: number;
	brand: 'visa' | 'mastercard' | 'amex' | 'verve' | 'unknown';
	createdAt?: string;
}

export type PaymentCardCreation = Omit<
	PaymentCardPayload,
	'id' | 'last4' | 'isDefault' | 'brand' | 'createdAt'
>;

export const PAYMENT_METHODS = {
	paystack: ['card', 'apple_pay', 'google_pay'],
	paypal: ['card', 'paypal'],
} as const;

export type PaymentProviders = typeof PAYMENT_METHODS;
export type PaymentProvider = keyof PaymentProviders;

export type PaymentMethod<P extends PaymentProvider = PaymentProvider> =
	PaymentProviders[P][number];

export type ProviderMethodPair = {
	[P in PaymentProvider]: { provider: P; method: PaymentMethod<P> };
}[PaymentProvider];

export const PaymentMethodEnum = Object.freeze(
	Object.fromEntries(Object.keys(PAYMENT_METHODS).map((k) => [k, k]))
) as { readonly [K in keyof typeof PAYMENT_METHODS]: K };

export type PaymentMethodEnum = typeof PaymentMethodEnum;
