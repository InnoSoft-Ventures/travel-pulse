export interface PaymentCard {
	cardName: string | null;
	authorizationCode: string;
	last4: string;
	expMonth: string;
	expYear: string;
	channel: string;
	cardType: string;
	bank: string;
	countryCode: string;
	brand: string;
	reusable: boolean;
	signature: string;
}
