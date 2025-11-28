import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import User from './User';
import { OrderStatus } from '@travelpulse/interfaces';
import OrderItem from './OrderItem';

export interface OrderAttributes {
	id: number;
	orderNumber: string;
	userId: number;
	totalAmount: number;
	status: OrderStatus;
	currency: string;
	createdAt: Date;
	updatedAt: Date;
}

export type OrderCreationAttributes = Optional<
	OrderAttributes,
	'id' | 'status' | 'createdAt' | 'updatedAt'
>;

class Order extends Model<OrderAttributes, OrderCreationAttributes> {
	public id!: number;
	public orderNumber!: string;
	public userId!: number;
	public totalAmount!: number;
	public status!: OrderStatus;
	public currency!: string;

	public user?: User | null;
	public orderItems!: OrderItem[];
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
		orderNumber: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			field: 'order_number',
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
				OrderStatus.PROCESSING_PAYMENT,
				OrderStatus.PAID,
				OrderStatus.PAYMENT_FAILED,
				OrderStatus.COMPLETED,
				OrderStatus.CANCELLED
			),
			defaultValue: OrderStatus.PENDING,
		},
		currency: {
			allowNull: false,
			type: DataTypes.STRING(3),
			defaultValue: 'USD',
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
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
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
