import { DataTypes, Model, Optional } from 'sequelize';
import dbConnect from '..';
import User from './User';

export interface RefreshTokenAttributes {
	id: number;
	tokenHash: string;
	expiresAt: Date;
	userId: number;
	userAgent?: string | null;
	createdByIp?: string | null;
	revokedAt?: Date | null;
	revokedByIp?: string | null;
	replacedByToken?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export type RefreshTokenCreationAttributes = Optional<
	RefreshTokenAttributes,
	| 'id'
	| 'userAgent'
	| 'createdByIp'
	| 'revokedAt'
	| 'revokedByIp'
	| 'replacedByToken'
	| 'createdAt'
	| 'updatedAt'
>;

class RefreshToken
	extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
	implements RefreshTokenAttributes
{
	public id!: number;
	public tokenHash!: string;
	public expiresAt!: Date;
	public userId!: number;
	public userAgent?: string | null;
	public createdByIp?: string | null;
	public revokedAt?: Date | null;
	public revokedByIp?: string | null;
	public replacedByToken?: string | null;

	public readonly createdAt!: Date;
	public updatedAt!: Date;
}

RefreshToken.init(
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
		expiresAt: {
			allowNull: false,
			field: 'expires_at',
			type: DataTypes.DATE,
		},
		createdByIp: {
			allowNull: true,
			field: 'created_by_ip',
			type: DataTypes.STRING(45),
		},
		userAgent: {
			allowNull: true,
			field: 'user_agent',
			type: DataTypes.STRING(512),
		},
		revokedAt: {
			allowNull: true,
			field: 'revoked_at',
			type: DataTypes.DATE,
		},
		revokedByIp: {
			allowNull: true,
			field: 'revoked_by_ip',
			type: DataTypes.STRING(45),
		},
		replacedByToken: {
			allowNull: true,
			field: 'replaced_by_token',
			type: DataTypes.STRING(128),
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
		modelName: 'RefreshToken',
		tableName: 'refresh_tokens',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
);

RefreshToken.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
});

User.hasMany(RefreshToken, {
	foreignKey: 'userId',
	as: 'refreshTokens',
});

export default RefreshToken;
