import { ApnType } from "./enums";

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
		[key in "ios" | "android"]: {
			apn_type: string;
			apn_value: string | null;
		};
	};
	msisdn: string | null;
	direct_apple_installation_url: string;
}

export type SimPackageType = "local" | "global" | "regional";
