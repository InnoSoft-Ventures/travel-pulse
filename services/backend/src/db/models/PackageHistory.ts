import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Sim from './Sims';
import ProviderOrder from './ProviderOrder';
import { SimStatus } from '@travelpulse/interfaces';

export enum PackageActionType {
	INITIAL_PURCHASE = 'initial_purchase',
	TOP_UP = 'top_up',
	RENEWAL = 'renewal',
}

export interface PackageHistoryAttributes {
	id: number;
	simId: number;
	providerOrderId: number | null;
	actionType: PackageActionType;
	status: SimStatus;
	packageId: string;
	packageName: string;
	dataAmount: number;
	voiceAmount: number;
	textAmount: number;
	validityDays: number;
	price: number;
	netPrice: number | null;
	currency: string;
	activatedAt: Date | null;
	expiresAt: Date | null;
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
	public dataAmount!: number;
	public voiceAmount!: number;
	public textAmount!: number;
	public validityDays!: number;
	public price!: number;
	public netPrice!: number | null;
	public currency!: string;
	public activatedAt!: Date | null;
	public expiresAt!: Date | null;
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
		dataAmount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'data_amount',
		},
		voiceAmount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'voice_amount',
			defaultValue: 0,
		},
		textAmount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'text_amount',
			defaultValue: 0,
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
		timestamps: false,
	}
);

PackageHistory.belongsTo(Sim, {
	foreignKey: 'simId',
	as: 'sim',
});

PackageHistory.belongsTo(ProviderOrder, {
	foreignKey: 'providerOrderId',
	as: 'providerOrder',
});

export default PackageHistory;
