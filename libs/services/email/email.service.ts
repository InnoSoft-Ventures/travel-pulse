import { EmailService } from './service';
import { determineBaseUrl } from './util';
import {
	AccountVerificationData,
	PasswordResetData,
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
