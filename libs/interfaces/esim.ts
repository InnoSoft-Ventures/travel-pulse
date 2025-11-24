import { SimStatus } from './enums';
import { Country, Continent } from './common';

export interface SIMInfo {
	id: number;
	name: string;
	status: SimStatus;
	remaining: number;
	total: number;
	expiredAt: string;
}

type SimAPNSettings = {
	[key: string]: {
		apn_type: string;
		apn_value: string | null;
	};
};

export interface SIMDetails extends SIMInfo {
	msisdn: string | null;
	iccid: string;
	lpa: string;
	activationCode: string | null;
	qrcodeUrl: string | null;
	validity: string;
	apnType: string;
	apnValue: string | null;
	isRoaming: boolean;
	confirmationCode: string | null;
	apn: SimAPNSettings | null;
	directAppleInstallationUrl: string;
	providerOrder: {
		id: number;
		packageId: string;
		type: string;
		voice: number | null;
		text: number | null;
		price: string | number | null;
		currency: string | null;
	} | null;
	order: { id: number; orderNumber: string } | null;
	/**
	 * Country where this eSIM/package primarily applies. Derived from the package's operator.
	 */
	country: Pick<Country, 'id' | 'name' | 'iso2' | 'flag'> | null;
	/**
	 * Continent derived from the operator's country.
	 */
	continent: Pick<Continent, 'id' | 'name'> | null;
}

export interface SIMInfoResponse {
	items: SIMDetails[];
	page: number;
	size: number;
	total: number;
}
