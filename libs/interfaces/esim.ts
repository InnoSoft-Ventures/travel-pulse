export interface EsimListItem {
	id: number;
	status: string;
	msisdn: string | null;
	remaining: number;
	total: number;
	expiredAt: string;
	apnType: string;
	apnValue: string | null;
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

export interface EsimListResponse {
	items: EsimListItem[];
	page: number;
	size: number;
	total: number;
}
