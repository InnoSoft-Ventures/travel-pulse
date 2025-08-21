import { PackageType, SIM } from '@travelpulse/interfaces';

export interface AiraloCountry {
	country_code: string;
	title: string;
}

export interface Package {
	id: string;
	type: PackageType;
	price: number;

	/** Amount in MB */
	amount: number;

	/** Number of days */
	day: number;
	is_unlimited: boolean;
	title: string;
	data: string;
	short_info: string | null;

	/** HTML string content */
	qr_installation: string | null;

	/** HTML string content */
	manual_installation: string | null;
	voice: number | null;
	text: number | null;
	net_price: number | null;
}

export interface AiraloNetwork {
	name: string;
	types: string[];
}

export interface AiraloCoverage {
	/** Country ISO2 */
	name: string;
	code: string;
	networks: AiraloNetwork[];
}

export interface AiraloOperator {
	id: number;
	style: string;
	gradient_start: string;
	gradient_end: string;
	type: 'local' | 'global' | 'regional';
	is_prepaid: boolean;
	title: string;
	esim_type: string;
	warning: string | null;
	apn_type: string;
	apn_value: string | null;
	is_roaming: boolean;
	info: string[] | null;
	image?: {
		width: number;
		height: number;
		url: string;
	};
	plan_type: 'data' | 'voice' | 'data_voice';
	activation_policy: string;
	is_kyc_verify: boolean;
	rechargeability: boolean;
	other_info: string;
	coverages: AiraloCoverage[];
	apn: {
		ios: {
			apn_type: string;
			apn_value: null;
		};
		android: {
			apn_type: string;
			apn_value: null;
		};
	};
	packages: Package[];
	countries: AiraloCountry[];
}

export interface AiraloPackage {
	/** Possibly "world" and "regional" if contains a region name, for example, "europe" or "Africa" and "local" if has country name */
	slug: string;

	/** Country code will be empty if package is "regional" or "world" */
	country_code: string;
	title: string;
	operators: AiraloOperator[];
}

export interface AiraloPackageWithCountryId extends AiraloPackage {
	countryId: number;
}

export interface AiraloPackageResponse {
	/** The package data */
	data: AiraloPackage[];
	links: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
	meta: {
		message: string;
		current_page: number;
		from: number;
		last_page: number;
		path: string;
		per_page: string;
		to: number;
		total: number;
	};
}

export interface ProviderAccessToken {
	data: {
		token_type: string;
		expires_in: number;
		access_token: string;
	};
}

export type AiraloNotificationType =
	| 'async_orders'
	| 'webhook_low_data'
	| 'email_low_data'
	| 'webhook_credit_limit';

export interface AiraloOrderNotification {
	type: 'async_orders';
	webhook_url: string;
}

export interface AiraloLowDataNotification {
	type: 'webhook_low_data' | 'email_low_data';
	webhook_url?: string;
	email?: string;
	language: 'en';
}

export interface AiraloCreditLimitNotification {
	type: 'webhook_credit_limit';
	webhook_url: string;
	/** receive notification via email */
	email_credit_limit: string;
	email: string;
	language: 'en';
}

export type AiraloNotification =
	| AiraloOrderNotification
	| AiraloLowDataNotification
	| AiraloCreditLimitNotification;

export interface AiraloOrderRequest {
	packageId: string;
	type: PackageType;
	quantity: number;
}

export interface AiraloOrderResponse {
	data: {
		request_id: string;
		accepted_at: string;
	};
}

export type AiraloInstallationGuide = {
	[key in 'en']: string;
};

export type AiraloAsyncOrderResponse = {
	data: {
		'0': {
			data: {
				text: null;
				voice: null;
			};
		};
		id: number;
		code: string;
		currency: string;
		package_id: string;
		quantity: number;
		type: PackageType;
		description: string;
		esim_type: string;
		validity: number;
		package: string;
		data: string;
		price: number;
		net_price: number;
		created_at: string;
		manual_installation: string;
		qrcode_installation: string;
		installation_guides: AiraloInstallationGuide;
		sims: SIM[];
	};
	request_id: string;
};
