import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Sim from './Sims';
import ProviderOrder from './ProviderOrder';
import { PackageActionType, SimStatus } from '@travelpulse/interfaces';

export interface PackageHistoryAttributes {
	id: number;
	simId: number;
	providerOrderId: number | null;
	actionType: PackageActionType;
	status: SimStatus;
	packageId: string;
	packageName: string;
	validityDays: number;
	price: number;
	netPrice: number | null;
	currency: string;
	activatedAt: Date | null;
	expiresAt: Date | null;
	// Usage tracking fields
	remainingData: number;
	totalData: number;
	remainingVoice: number;
	totalVoice: number;
	remainingText: number;
	totalText: number;
	isUnlimited: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type PackageHistoryCreationAttributes = Optional<
	PackageHistoryAttributes,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'providerOrderId'
	| 'netPrice'
	| 'activatedAt'
	| 'expiresAt'
>;

class PackageHistory extends Model<
	PackageHistoryAttributes,
	PackageHistoryCreationAttributes
> {
	public id!: number;
	public simId!: number;
	public providerOrderId!: number | null;
	public actionType!: PackageActionType;
	public status!: SimStatus;
	public packageId!: string;
	public packageName!: string;
	public validityDays!: number;
	public price!: number;
	public netPrice!: number | null;
	public currency!: string;
	public activatedAt!: Date | null;
	public expiresAt!: Date | null;
	// Usage tracking
	public remainingData!: number;
	public totalData!: number;
	public remainingVoice!: number;
	public totalVoice!: number;
	public remainingText!: number;
	public totalText!: number;
	public isUnlimited!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

PackageHistory.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		simId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'sim_id',
			references: {
				model: Sim,
				key: 'id',
			},
		},
		providerOrderId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'provider_order_id',
			references: {
				model: ProviderOrder,
				key: 'id',
			},
		},
		actionType: {
			allowNull: false,
			type: DataTypes.ENUM(
				PackageActionType.INITIAL_PURCHASE,
				PackageActionType.TOP_UP,
				PackageActionType.RENEWAL
			),
			field: 'action_type',
			defaultValue: PackageActionType.INITIAL_PURCHASE,
		},
		status: {
			allowNull: false,
			type: DataTypes.ENUM(
				SimStatus.NOT_ACTIVE,
				SimStatus.ACTIVE,
				SimStatus.FINISHED,
				SimStatus.DEACTIVATED,
				SimStatus.UNKNOWN,
				SimStatus.EXPIRED,
				SimStatus.RECYCLED
			),
			defaultValue: SimStatus.NOT_ACTIVE,
		},
		packageId: {
			allowNull: false,
			type: DataTypes.STRING,
			field: 'package_id',
		},
		packageName: {
			allowNull: false,
			type: DataTypes.STRING,
			field: 'package_name',
		},
		validityDays: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'validity_days',
		},
		price: {
			allowNull: false,
			type: DataTypes.DECIMAL(10, 2),
		},
		netPrice: {
			allowNull: true,
			type: DataTypes.DECIMAL(10, 2),
			field: 'net_price',
		},
		currency: {
			allowNull: false,
			type: DataTypes.STRING(3),
		},
		activatedAt: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'activated_at',
		},
		expiresAt: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'expires_at',
		},
		remainingData: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'remaining_data',
			defaultValue: 0,
		},
		totalData: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'total_data',
			defaultValue: 0,
		},
		remainingVoice: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'remaining_voice',
			defaultValue: 0,
		},
		totalVoice: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'total_voice',
			defaultValue: 0,
		},
		remainingText: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'remaining_text',
			defaultValue: 0,
		},
		totalText: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'total_text',
			defaultValue: 0,
		},
		isUnlimited: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
			field: 'is_unlimited',
			defaultValue: false,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			field: 'created_at',
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			field: 'updated_at',
		},
	},
	{
		sequelize: dbConnect,
		modelName: 'PackageHistory',
		tableName: 'package_history',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
);

PackageHistory.belongsTo(Sim, {
	foreignKey: 'simId',
	as: 'sim',
});

Sim.hasMany(PackageHistory, {
	foreignKey: 'simId',
	as: 'packageHistories',
});

PackageHistory.belongsTo(ProviderOrder, {
	foreignKey: 'providerOrderId',
	as: 'providerOrder',
});

export default PackageHistory;
