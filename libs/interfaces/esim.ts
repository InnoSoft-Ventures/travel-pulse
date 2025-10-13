import { SimStatus } from './enums';

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
}

export interface SIMInfoResponse {
	items: SIMInfo[];
	page: number;
	size: number;
	total: number;
}
