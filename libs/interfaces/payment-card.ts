export interface PaymentCard {
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
	PaymentCard,
	'id' | 'last4' | 'isDefault' | 'brand' | 'createdAt'
>;
