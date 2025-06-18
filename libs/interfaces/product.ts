import { ApnType } from './enums';

export interface SIM {
	id: number;
	created_at: string;
	iccid: string;
	lpa: string;
	imsis: string | null;
	matching_id: string;
	qrcode: string;
	qrcode_url: string;
	airalo_code: string | null;
	apn_type: ApnType;
	apn_value: string | null;
	is_roaming: boolean;
	confirmation_code: string | null;
	apn: {
		[key in 'ios' | 'android']: {
			apn_type: string;
			apn_value: string | null;
		};
	};
	msisdn: string | null;
	direct_apple_installation_url: string;
}

export type SimPackageType = 'local' | 'global' | 'regional';

export interface RegionExplore {
	name: string;
	operatorId: string;
	regionId: number | null;
	price: string;
	data: string;
	amount: number;
	type: string;
}

// Network types for coverage
export interface Network {
	name: string;
	types: string[];
}

// Coverage information for a destination
export interface Coverage {
	data: { name: string; code: string; networks: Network[] };
}

// Package details
export interface Package {
	packageId: number;
	title: string;
	price: string;
	/** Amount of data in digits, i.e 2048 ~ 2GB */
	amount: number;
	/** Amount of data in units, e.g 2GB */
	data: string;
	/** Validity period in days */
	day: number;
	isUnlimited: boolean;
}

// Destination information
export interface Destination {
	id: number;
	title: string;
	type: string;
	esimType: string;
	apnType: string;
	packages: Package[];
	coverage: Coverage[];
}

// Main package search results
export interface PackageResults {
	/** List of available destinations with their packages */
	destinations: Destination | null;
	/** Duration of travel in days */
	travelDuration: number;
}
