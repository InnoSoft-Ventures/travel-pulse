export interface BaseTemplateData {
	firstName: string;
	lastName: string;
}

export interface AccountVerificationData extends BaseTemplateData {
	verifyUrl: string;
}

export interface PasswordResetData extends BaseTemplateData {
	resetUrl: string;
}

export interface PaymentConfirmedData extends BaseTemplateData {
	orderNumber: string;
	amount: number;
	currency: string;
	amountFormatted?: string;
	paymentId?: string;
	viewOrderUrl?: string;
	supportUrl?: string;
}

export interface SimInfo {
	id: number;
	iccid: string;
	msisdn?: string | null;
}

export interface OrderConfirmationData extends BaseTemplateData {
	orderNumber: string;
	totalAmount: number;
	currency: string;
	sims: SimInfo[];
	orderItems: Array<{
		planName: string;
		region: string;
		quantity: number;
		price: number;
	}>;
	viewOrderUrl?: string;
	supportUrl?: string;
}

export type TemplatePayloadMap = {
	'account-verify': AccountVerificationData;
	'password-reset': PasswordResetData;
	'payment-confirmed': PaymentConfirmedData;
	'order-confirmation': OrderConfirmationData;
};
