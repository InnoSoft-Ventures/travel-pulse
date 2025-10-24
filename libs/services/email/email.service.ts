import { EmailService } from './service';
import { determineBaseUrl } from './util';
import {
	AccountVerificationData,
	PasswordResetData,
	PaymentConfirmedData,
	OrderConfirmationData,
} from './types/email-types';

// Initialize singleton when module loads
export const email = EmailService.init();

export const sendAccountVerificationEmail = async (
	to: string,
	params: AccountVerificationData
) => {
	const url = determineBaseUrl(params.verifyUrl);

	await email.send({
		to,
		template: 'account-verify',
		data: {
			...params,
			verifyUrl: url,
		},
	});
};

export const sendPasswordResetEmail = async (
	to: string,
	params: PasswordResetData
) => {
	const url = determineBaseUrl(params.resetUrl);

	await email.send({
		to,
		template: 'password-reset',
		data: {
			...params,
			resetUrl: url,
		},
	});
};

export const sendPaymentConfirmedEmail = async (
	to: string,
	params: PaymentConfirmedData
) => {
	const viewOrderUrl = params.viewOrderUrl
		? determineBaseUrl(params.viewOrderUrl)
		: undefined;
	const supportUrl = params.supportUrl
		? determineBaseUrl(params.supportUrl)
		: undefined;

	let amountFormatted: string;

	try {
		amountFormatted = new Intl.NumberFormat('en-ZA', {
			style: 'currency',
			currency: params.currency,
		}).format(params.amount);
	} catch (error) {
		amountFormatted = `${params.currency} ${params.amount.toFixed(2)}`;
	}

	await email.send({
		to,
		template: 'payment-confirmed',
		data: {
			...params,
			viewOrderUrl,
			supportUrl,
			amountFormatted,
		},
	});
};

export const sendOrderConfirmationEmail = async (
	to: string,
	params: OrderConfirmationData
) => {
	const viewOrderUrl = params.viewOrderUrl
		? determineBaseUrl(params.viewOrderUrl)
		: undefined;
	const supportUrl = params.supportUrl
		? determineBaseUrl(params.supportUrl)
		: undefined;

	await email.send({
		to,
		template: 'order-confirmation',
		data: {
			...params,
			viewOrderUrl,
			supportUrl,
		},
	});
};
