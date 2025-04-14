import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import User from './User';
import { OrderStatus } from '@travelpulse/interfaces';

export interface OrderAttributes {
	id: number;
	userId: number;
	totalAmount: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}

export type OrderCreationAttributes = Optional<
	OrderAttributes,
	'id' | 'status' | 'createdAt' | 'updatedAt'
>;

class Order extends Model<OrderAttributes, OrderCreationAttributes> {
	public id!: number;
	public userId!: number;
	public totalAmount!: number;
	public status!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Order.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		userId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'user_id',
			references: {
				model: User,
				key: 'id',
			},
		},
		totalAmount: {
			allowNull: false,
			field: 'total_amount',
			type: DataTypes.DECIMAL(10, 2),
		},
		status: {
			allowNull: false,
			type: DataTypes.ENUM(
				OrderStatus.PENDING,
				OrderStatus.PROCESSING,
				OrderStatus.COMPLETED,
				OrderStatus.CANCELLED
			),
			defaultValue: OrderStatus.PENDING,
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
		modelName: 'Order',
		tableName: 'orders',
		timestamps: false,
	}
);

Order.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
});

User.hasMany(Order, {
	foreignKey: 'userId',
	as: 'orders',
});

export default Order;
