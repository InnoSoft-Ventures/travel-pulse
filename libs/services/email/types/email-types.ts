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

export type TemplatePayloadMap = {
	'account-verify': AccountVerificationData;
	'password-reset': PasswordResetData;
};
