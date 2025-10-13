export const SOMETHING_WENT_WRONG = 'Something went wrong, please try again.';

export const INVALID_CREDENTIALS = 'Invalid credentials.';
export const ERROR_CODE = {
	EMAIL_ALREADY_IN_USE: 'email_already_in_use',
	INVALID_TOKEN: 'invalid_token',
	INVALID_CREDENTIALS: 'invalid_credentials',
};

export enum OrderStatus {
	PENDING = 'PENDING',
	PROCESSING_PAYMENT = 'PROCESSING_PAYMENT',
	PAID = 'PAID',
	COMPLETED = 'COMPLETED',
	PAYMENT_FAILED = 'PAYMENT_FAILED',
	CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
	INITIATED = 'initiated',
	FAILED = 'failed',
	REQUIRES_ACTION = 'requires_action',
	PAID = 'paid',
}

export enum ProviderOrderStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export enum ProviderIdentity {
	AIRALO = 'Airalo',
	ESIMACCESS = 'eSIMAccess',
}

export enum PackageType {
	SIM = 'sim',
}

export type ApnType = 'automatic' | 'manual';

export enum SimPackageTypeEnum {
	LOCAL = 'local',
	GLOBAL = 'global',
	REGIONAL = 'regional',
}

export enum SimStatus {
	NOT_ACTIVE = 'NOT_ACTIVE',
	ACTIVE = 'ACTIVE',
	FINISHED = 'FINISHED',
	DEACTIVATED = 'DEACTIVATED',
	UNKNOWN = 'UNKNOWN',
	EXPIRED = 'EXPIRED',
}
