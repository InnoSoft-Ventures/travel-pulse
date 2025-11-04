import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Order from './Order';
import Package from './Package';
import Sim from './Sims';

export interface OrderItemAttributes {
	id: number;
	orderId: number;
	packageId: number;
	quantity: number;
	startDate: string;
	iccid: string;
	price: number;
	createdAt: Date;
	updatedAt: Date;
}

export type OrderItemCreationAttributes = Optional<
	OrderItemAttributes,
	'id' | 'createdAt' | 'updatedAt' | 'iccid'
>;

class OrderItem extends Model<
	OrderItemAttributes,
	OrderItemCreationAttributes
> {
	public id!: number;
	public orderId!: number;
	public packageId!: number;
	public quantity!: number;
	public startDate!: string;
	public iccid!: string;
	public price!: number;

	public sim?: Sim | null;
	public createdAt!: Date;
	public updatedAt!: Date;
}

OrderItem.init(
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
		packageId: {
			allowNull: false,
			type: DataTypes.BIGINT,
			field: 'package_id',
			references: {
				model: Package,
				key: 'id',
			},
		},
		quantity: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		price: {
			allowNull: false,
			type: DataTypes.DECIMAL(10, 2),
		},
		iccid: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'iccid',
			references: {
				model: Sim,
				key: 'iccid',
			},
		},
		startDate: {
			allowNull: false,
			type: DataTypes.STRING(10),
			field: 'start_date',
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
		modelName: 'OrderItem',
		tableName: 'order_items',
		timestamps: false,
	}
);

OrderItem.belongsTo(Order, {
	foreignKey: 'orderId',
	as: 'order',
});

Order.hasMany(OrderItem, {
	foreignKey: 'orderId',
	as: 'orderItems',
});

OrderItem.belongsTo(Package, {
	foreignKey: 'packageId',
	as: 'package',
});

OrderItem.belongsTo(Sim, {
	foreignKey: 'iccid',
	targetKey: 'iccid',
	as: 'sim',
	constraints: false,
});

Sim.hasOne(OrderItem, {
	foreignKey: 'iccid',
	sourceKey: 'iccid',
	as: 'orderItem',
	constraints: false,
});

export default OrderItem;
