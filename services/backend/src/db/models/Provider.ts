// models/provider.model.ts

import { DataTypes, Model, Optional } from 'sequelize';
import dbConnect from '..';
import { ProviderIdentity } from '@travelpulse/interfaces';

export interface ProviderAttributes {
	id: number;
	name: string;
	identityName: ProviderIdentity;
	enabled: boolean;
	accessToken: string;
	expiresIn: number;
	tokenType: string;
	grantType: string;
	clientId: string;
	clientSecret: string;
	createdAt: Date;
}

type ProviderCreationAttributes = Optional<
	ProviderAttributes,
	'id' | 'accessToken' | 'expiresIn' | 'createdAt'
>;

class Provider extends Model<ProviderAttributes, ProviderCreationAttributes> {
	public id!: number;
	public name!: string;
	public identityName!: ProviderIdentity;
	public enabled!: boolean;
	public accessToken!: string;
	public expiresIn!: number;
	public tokenType!: string;
	public grantType!: string;
	public clientId!: string;
	public clientSecret!: string;
	public createdAt!: Date;
}

Provider.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		identityName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			field: 'identity_name',
		},
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		accessToken: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'access_token',
		},
		expiresIn: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'expires_in',
		},
		tokenType: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'token_type',
		},
		grantType: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'grant_type',
		},
		clientId: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'client_id',
		},
		clientSecret: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'client_secret',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'created_at',
		},
	},
	{
		sequelize: dbConnect,
		tableName: 'providers',
		timestamps: false,
	}
);

export default Provider;
