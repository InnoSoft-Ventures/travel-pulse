export interface SimInfo
	extends Omit<SimCardProps['data'], 'onRecharge' | 'onViewDetails'> {
	id: string;
}

export interface SimData {
	providerName: string;
	planName: string;
	phoneNumber: string;
	dataLeft: string;
	expiresOn: string;
	isActive: boolean;
}

export interface SimCardProps {
	data: SimData;
	onRecharge?: () => void;
	onViewDetails?: () => void;
}
