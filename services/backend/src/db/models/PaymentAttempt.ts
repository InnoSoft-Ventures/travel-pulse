import { DataTypes, Model, Optional } from 'sequelize';
import dbConnect from '..';
import Order from './Order';
import User from './User';
import { PaymentStatus, ProviderMethodPair } from '@travelpulse/interfaces';

export interface PaymentAttemptAttributes {
	id: number;
	orderId: number;
	userId: number;
	/** e.g., 'stripe', 'adyen', 'manual' */
	provider: ProviderMethodPair['provider'];
	/** e.g., 'card', 'apple_pay', 'google_pay' */
	method: ProviderMethodPair['method'];
	status: PaymentStatus;
	referenceId: string | null;
	amount: number;
	currency: string; // ISO 4217
	errorCode: string | null;
	errorMessage: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export type PaymentAttemptCreationAttributes = Optional<
	PaymentAttemptAttributes,
	| 'id'
	| 'referenceId'
	| 'errorCode'
	| 'errorMessage'
	| 'createdAt'
	| 'updatedAt'
>;

class PaymentAttempt
	extends Model<PaymentAttemptAttributes, PaymentAttemptCreationAttributes>
	implements PaymentAttemptAttributes
{
	public id!: number;
	public orderId!: number;
	public userId!: number;
	public provider!: ProviderMethodPair['provider'];
	public method!: ProviderMethodPair['method'];
	public status!: PaymentStatus;
	public referenceId!: string | null;
	public amount!: number;
	public currency!: string;
	public errorCode!: string | null;
	public errorMessage!: string | null;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

PaymentAttempt.init(
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
			references: { model: Order, key: 'id' },
		},
		userId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'user_id',
			references: { model: User, key: 'id' },
		},
		provider: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		method: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		status: {
			allowNull: false,
			type: DataTypes.ENUM(
				PaymentStatus.INITIATED,
				PaymentStatus.FAILED,
				PaymentStatus.REQUIRES_ACTION,
				PaymentStatus.PAID
			),
			defaultValue: PaymentStatus.INITIATED,
		},
		referenceId: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'reference_id',
		},
		amount: {
			allowNull: false,
			type: DataTypes.DECIMAL(10, 2),
		},
		currency: {
			allowNull: false,
			type: DataTypes.STRING(3),
		},
		errorCode: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'error_code',
		},
		errorMessage: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'error_message',
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
		modelName: 'PaymentAttempt',
		tableName: 'payment_attempts',
		timestamps: false,
		indexes: [
			{
				name: 'idx_payment_attempts_order_status',
				fields: ['order_id', 'status'],
			},
		],
	}
);

PaymentAttempt.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(PaymentAttempt, { foreignKey: 'orderId', as: 'paymentAttempts' });

PaymentAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PaymentAttempt, { foreignKey: 'userId', as: 'paymentAttempts' });

export default PaymentAttempt;
