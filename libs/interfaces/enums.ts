export const SOMETHING_WENT_WRONG = "Something went wrong, please try again.";

export const INVALID_CREDENTIALS = "Invalid credentials.";
export const ERROR_CODE = {
	EMAIL_ALREADY_IN_USE: "email_already_in_use",
	INVALID_TOKEN: "invalid_token",
	INVALID_CREDENTIALS: "invalid_credentials",
};

export enum OrderStatus {
	PENDING = "pending",
	PROCESSING = "processing",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}

export enum OrderProviderStatus {
	PENDING = "pending",
	PROCESSING = "processing",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}

export enum ProviderIdentity {
	AIRALO = "airalo",
	ESIMACCESS = "esimaccess",
}

export enum PackageType {
	SIM = "sim",
}
