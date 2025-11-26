import { Transaction } from 'sequelize';
import PackageHistory, {
	PackageActionType,
	PackageHistoryCreationAttributes,
} from '../db/models/PackageHistory';
import { SimStatus } from '@travelpulse/interfaces';

export interface CreatePackageHistoryData {
	simId: number;
	providerOrderId?: number;
	actionType: PackageActionType;
	status: SimStatus;
	packageId: string;
	packageName: string;
	dataAmount: number;
	voiceAmount?: number;
	textAmount?: number;
	validityDays: number;
	price: number;
	netPrice?: number;
	currency: string;
	activatedAt?: Date;
	expiresAt?: Date;
}

/**
 * Creates a package history record for tracking package purchases and top-ups
 * @param data - The package history data
 * @param transact - The transaction object
 * @returns The created package history record
 */
export async function createPackageHistoryRecord(
	data: CreatePackageHistoryData,
	transact: Transaction
): Promise<PackageHistory> {
	const historyData: PackageHistoryCreationAttributes = {
		simId: data.simId,
		providerOrderId: data.providerOrderId || null,
		actionType: data.actionType,
		status: data.status,
		packageId: data.packageId,
		packageName: data.packageName,
		dataAmount: data.dataAmount,
		voiceAmount: data.voiceAmount || 0,
		textAmount: data.textAmount || 0,
		validityDays: data.validityDays,
		price: data.price,
		netPrice: data.netPrice || null,
		currency: data.currency,
		activatedAt: data.activatedAt || null,
		expiresAt: data.expiresAt || null,
	};

	return await PackageHistory.create(historyData, { transaction: transact });
}
