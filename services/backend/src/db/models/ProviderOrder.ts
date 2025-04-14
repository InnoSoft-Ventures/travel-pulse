import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import {
	ProviderOrderStatus,
	ProviderIdentity,
	PackageType,
} from '@travelpulse/interfaces';
import Order from './Order';
import { AiraloInstallationGuide } from '@travelpulse/providers';

export interface ProviderOrderAttributes {
	id: number;
	orderId: number;
	status: ProviderOrderStatus;
	provider: ProviderIdentity;
	externalRequestId: string;
	externalOrderId: string;
	currency: string;
	packageId: string;
	quantity: number;
	type: PackageType;
	description: string;
	esimType: string;
	validity: number;
	package: string;
	data: string;
	dataAmount: number;
	text: number | null;
	voice: number | null;
	netPrice: number;
	price: number;
	manualInstallation: string;
	qrcodeInstallation: string;
	installationGuides: AiraloInstallationGuide;
	createdAt: Date;
	updatedAt: Date;
}

export type ProviderOrderCreationAttributes = Optional<
	ProviderOrderAttributes,
	| 'id'
	| 'status'
	| 'createdAt'
	| 'updatedAt'
	| 'externalRequestId'
	| 'orderId'
	| 'provider'
	| 'externalOrderId'
	| 'currency'
	| 'packageId'
	| 'quantity'
	| 'type'
	| 'description'
	| 'esimType'
	| 'validity'
	| 'package'
	| 'data'
	| 'dataAmount'
	| 'text'
	| 'voice'
	| 'price'
	| 'manualInstallation'
	| 'qrcodeInstallation'
	| 'installationGuides'
	| 'netPrice'
>;

class ProviderOrder extends Model<
	ProviderOrderAttributes,
	ProviderOrderCreationAttributes
> {
	public id!: number;
	public orderId!: number;
	public provider!: ProviderIdentity;
	public status!: ProviderOrderStatus;
	public externalRequestId!: string;
	public externalOrderId!: string;
	public currency!: string;
	public packageId!: string;
	public quantity!: number;
	public type!: PackageType;
	public description!: string;
	public esimType!: string;
	public validity!: number;
	public package!: string;
	public data!: string;
	public dataAmount!: number;
	public text!: number | null;
	public voice!: number | null;
	public netPrice!: number;
	public price!: number;
	public manualInstallation!: string;
	public qrcodeInstallation!: string;
	public installationGuides!: AiraloInstallationGuide;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

ProviderOrder.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		orderId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'order_id',
			references: {
				model: Order,
				key: 'id',
			},
		},
		provider: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		externalRequestId: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'external_request_id',
		},
		externalOrderId: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'external_order_id',
		},
		status: {
			allowNull: false,
			type: DataTypes.ENUM(
				ProviderOrderStatus.PENDING,
				ProviderOrderStatus.PROCESSING,
				ProviderOrderStatus.COMPLETED,
				ProviderOrderStatus.CANCELLED
			),
			defaultValue: ProviderOrderStatus.PENDING,
		},
		currency: {
			allowNull: false,
			type: DataTypes.STRING(3), // 3-letter currency codes (e.g., USD)
		},
		packageId: {
			allowNull: false,
			type: DataTypes.STRING,
			field: 'package_id',
		},
		quantity: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		type: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		description: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
		esimType: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'esim_type',
		},
		validity: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 30, // default validity period of 30 days
		},
		package: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		data: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		dataAmount: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'data_amount',
		},
		text: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		voice: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		netPrice: {
			allowNull: true,
			field: 'net_price',
			type: DataTypes.DECIMAL(10, 2),
		},
		price: {
			allowNull: true,
			type: DataTypes.DECIMAL(10, 2),
		},
		manualInstallation: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'manual_installation',
		},
		qrcodeInstallation: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'qrcode_installation',
		},
		installationGuides: {
			allowNull: true,
			type: DataTypes.JSON,
			field: 'installation_guides',
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
		modelName: 'ProviderOrder',
		tableName: 'provider_orders',
		timestamps: false,
	}
);

ProviderOrder.belongsTo(Order, {
	foreignKey: 'orderId',
	as: 'order',
});

Order.hasMany(ProviderOrder, {
	foreignKey: 'orderId',
	as: 'providerOrders',
});

export default ProviderOrder;
