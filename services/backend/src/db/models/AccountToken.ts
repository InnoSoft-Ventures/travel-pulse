import { DataTypes, Model, Optional } from 'sequelize';
import dbConnect from '..';
import User from './User';

export type AccountTokenType = 'ACCOUNT_ACTIVATION' | 'PASSWORD_RESET';

export interface AccountTokenAttributes {
	id: number;
	userId: number;
	tokenHash: string;
	tokenType: AccountTokenType;
	expiresAt: Date;
	consumedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export type AccountTokenCreationAttributes = Optional<
	AccountTokenAttributes,
	'id' | 'consumedAt' | 'createdAt' | 'updatedAt'
>;

class AccountToken
	extends Model<AccountTokenAttributes, AccountTokenCreationAttributes>
	implements AccountTokenAttributes
{
	public id!: number;
	public userId!: number;
	public tokenHash!: string;
	public tokenType!: AccountTokenType;
	public expiresAt!: Date;
	public consumedAt?: Date | null;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

AccountToken.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		userId: {
			allowNull: false,
			field: 'user_id',
			type: DataTypes.INTEGER,
		},
		tokenHash: {
			allowNull: false,
			field: 'token_hash',
			type: DataTypes.STRING(128),
			unique: true,
		},
		tokenType: {
			allowNull: false,
			field: 'token_type',
			type: DataTypes.STRING(32),
		},
		expiresAt: {
			allowNull: false,
			field: 'expires_at',
			type: DataTypes.DATE,
		},
		consumedAt: {
			allowNull: true,
			field: 'consumed_at',
			type: DataTypes.DATE,
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
		modelName: 'AccountToken',
		tableName: 'account_tokens',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
);

AccountToken.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
});

User.hasMany(AccountToken, {
	foreignKey: 'userId',
	as: 'accountTokens',
});

export default AccountToken;
