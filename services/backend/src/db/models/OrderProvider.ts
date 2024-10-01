import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import { OrderProviderStatus, ProviderIdentity } from '@libs/interfaces';
import Order from './Order';

export interface OrderProviderAttributes {
	id: number;
	orderId: number;
	status: OrderProviderStatus;
	provider: ProviderIdentity;
	externalRequestId: string;
	externalOrderProviderId: string;
	createdAt: Date;
	updatedAt: Date;
}

export type OrderProviderCreationAttributes = Optional<
	OrderProviderAttributes,
	'id' | 'status' | 'createdAt' | 'updatedAt' | 'externalOrderProviderId'
>;

class OrderProvider extends Model<
	OrderProviderAttributes,
	OrderProviderCreationAttributes
> {
	public id!: number;
	public orderId!: number;
	public provider!: ProviderIdentity;
	public status!: OrderProviderStatus;
	public externalRequestId!: string;
	public externalOrderProviderId!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

OrderProvider.init(
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
		externalOrderProviderId: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'external_order_id',
		},
		status: {
			allowNull: false,
			type: DataTypes.ENUM(
				OrderProviderStatus.PENDING,
				OrderProviderStatus.PROCESSING,
				OrderProviderStatus.COMPLETED,
				OrderProviderStatus.CANCELLED
			),
			defaultValue: OrderProviderStatus.PENDING,
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
		modelName: 'OrderProvider',
		tableName: 'order_providers',
		timestamps: false,
	}
);

OrderProvider.belongsTo(Order, {
	foreignKey: 'orderId',
	as: 'order',
});

Order.hasMany(OrderProvider, {
	foreignKey: 'orderId',
	as: 'orderProviders',
});

export default OrderProvider;
