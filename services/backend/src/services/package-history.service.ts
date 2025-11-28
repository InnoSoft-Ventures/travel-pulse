import { Transaction, Op } from 'sequelize';
import PackageHistory, {
	PackageActionType,
	PackageHistoryCreationAttributes,
} from '../db/models/PackageHistory';
import { SimStatus } from '@travelpulse/interfaces';
import { dateJs } from '@travelpulse/utils';

export interface CreatePackageHistoryData {
	simId: number;
	providerOrderId?: number;
	actionType: PackageActionType;
	status: SimStatus;
	packageId: string;
	packageName: string;
	validityDays: number;
	price: number;
	netPrice?: number;
	currency: string;
	activatedAt?: Date;
	expiresAt?: Date;
	// Usage tracking fields
	remainingData: number;
	totalData: number;
	remainingVoice?: number;
	totalVoice?: number;
	remainingText?: number;
	totalText?: number;
	isUnlimited?: boolean;
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
		validityDays: data.validityDays,
		price: data.price,
		netPrice: data.netPrice || null,
		currency: data.currency,
		activatedAt: data.activatedAt || null,
		expiresAt: data.expiresAt || null,
		// Usage tracking
		remainingData: data.remainingData,
		totalData: data.totalData,
		remainingVoice: data.remainingVoice || 0,
		totalVoice: data.totalVoice || 0,
		remainingText: data.remainingText || 0,
		totalText: data.totalText || 0,
		isUnlimited: data.isUnlimited || false,
	};

	return await PackageHistory.create(historyData, { transaction: transact });
}

/**
 * Get the active package for a SIM
 * Priority: ACTIVE status > latest NOT_ACTIVE > null
 * Also marks expired packages as EXPIRED
 */
export async function getActivePackageForSim(
	simId: number,
	transact?: Transaction
): Promise<PackageHistory | null> {
	// First, handle expiry transitions
	await markExpiredPackages(simId, transact);

	// Find active package
	let activePackage = await PackageHistory.findOne({
		where: {
			simId,
			status: SimStatus.ACTIVE,
		},
		order: [['createdAt', 'DESC']],
		transaction: transact,
	});

	// Fallback to latest NOT_ACTIVE if no ACTIVE found
	if (!activePackage) {
		activePackage = await PackageHistory.findOne({
			where: {
				simId,
				status: SimStatus.NOT_ACTIVE,
			},
			order: [['createdAt', 'DESC']],
			transaction: transact,
		});
	}

	return activePackage;
}

/**
 * Mark packages as EXPIRED if their expiresAt date has passed
 */
export async function markExpiredPackages(
	simId: number,
	transact?: Transaction
): Promise<void> {
	const now = new Date();

	await PackageHistory.update(
		{
			status: SimStatus.EXPIRED,
			remainingData: 0,
			remainingVoice: 0,
			remainingText: 0,
		},
		{
			where: {
				simId,
				status: {
					[Op.in]: [
						SimStatus.ACTIVE,
						SimStatus.NOT_ACTIVE,
						SimStatus.RECYCLED,
					],
				},
				expiresAt: {
					[Op.lte]: now,
				},
			},
			transaction: transact,
		}
	);
}

/**
 * Activate a package (set status to ACTIVE and activatedAt)
 */
export async function activatePackage(
	packageHistoryId: number,
	transact: Transaction
): Promise<void> {
	const packageToActivate = await PackageHistory.findByPk(packageHistoryId, {
		transaction: transact,
	});

	if (!packageToActivate) {
		throw new Error('Package history not found');
	}

	// Activate the new package
	const activatedAt = dateJs().toDate();
	const expiresAt = dateJs()
		.add(packageToActivate.validityDays || 0, 'day')
		.toDate();

	await packageToActivate.update(
		{
			status: SimStatus.ACTIVE,
			activatedAt,
			expiresAt,
		},
		{ transaction: transact }
	);
}
