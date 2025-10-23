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

export type TemplatePayloadMap = {
	'account-verify': AccountVerificationData;
	'password-reset': PasswordResetData;
	'payment-confirmed': PaymentConfirmedData;
};
