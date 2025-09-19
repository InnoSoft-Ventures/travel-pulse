import { DataTypes, Model, Optional } from 'sequelize';
import dbConnect from '..';
import User from './User';

export interface PaymentCardAttributes {
	id: number;
	userId: number;
	provider: string; // e.g., 'paystack'
	default: boolean;
	customerCode: string | null;
	brand: string | null;
	last4: string | null;
	expMonth: number | null;
	expYear: number | null;
	authorizationCode: string;
	signature: string | null;
	bank: string | null;
	countryCode: string | null;
	cardType: string | null;
	reusable: boolean | null;
	accountName: string | null;
	metadata: Record<string, any> | null;
	createdAt: Date;
	updatedAt: Date;
}

export type PaymentCardCreationAttributes = Optional<
	PaymentCardAttributes,
	| 'id'
	| 'signature'
	| 'bank'
	| 'countryCode'
	| 'cardType'
	| 'reusable'
	| 'accountName'
	| 'customerCode'
	| 'metadata'
	| 'createdAt'
	| 'updatedAt'
>;

class PaymentCard
	extends Model<PaymentCardAttributes, PaymentCardCreationAttributes>
	implements PaymentCardAttributes
{
	public id!: number;
	public userId!: number;
	public default!: boolean;
	public provider!: string;
	public customerCode!: string | null;
	public brand!: string | null;
	public last4!: string | null;
	public expMonth!: number | null;
	public expYear!: number | null;
	public authorizationCode!: string;
	public signature!: string | null;
	public bank!: string | null;
	public countryCode!: string | null;
	public cardType!: string | null;
	public reusable!: boolean | null;
	public accountName!: string | null;
	public metadata!: Record<string, any> | null;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

PaymentCard.init(
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
			references: { model: User, key: 'id' },
		},
		default: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		customerCode: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'customer_code',
		},
		provider: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		brand: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		last4: {
			allowNull: true,
			type: DataTypes.STRING(4),
		},
		expMonth: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'exp_month',
		},
		expYear: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'exp_year',
		},
		authorizationCode: {
			allowNull: false,
			type: DataTypes.STRING,
			field: 'authorization_code',
		},
		signature: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		bank: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		countryCode: {
			allowNull: true,
			type: DataTypes.STRING(2),
			field: 'country_code',
		},
		cardType: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'card_type',
		},
		reusable: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
		},
		accountName: {
			allowNull: true,
			type: DataTypes.STRING,
			field: 'account_name',
		},
		metadata: {
			allowNull: true,
			type: DataTypes.JSON,
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
		modelName: 'PaymentCard',
		tableName: 'payment_cards',
		timestamps: false,
		indexes: [
			{
				name: 'idx_payment_cards_user_provider_last4',
				fields: ['user_id', 'provider', 'last4'],
			},
		],
	}
);

PaymentCard.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PaymentCard, { foreignKey: 'userId', as: 'paymentCards' });

export default PaymentCard;
