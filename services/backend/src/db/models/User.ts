import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';

export interface UserAttributes {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	createdAt: Date;
	updatedAt: Date;
}

export type UserCreationAttributes = Optional<
	UserAttributes,
	'id' | 'createdAt' | 'updatedAt'
>;

class User extends Model<UserAttributes, UserCreationAttributes> {
	public id!: number;
	public firstName!: string;
	public lastName!: string;
	public email!: string;
	public phone!: string;
	public password!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		firstName: {
			allowNull: false,
			field: 'first_name',
			type: DataTypes.STRING,
		},
		lastName: {
			allowNull: false,
			field: 'last_name',
			type: DataTypes.STRING,
		},
		email: {
			allowNull: false,
			unique: true,
			type: DataTypes.STRING,
		},
		phone: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		password: {
			allowNull: false,
			type: DataTypes.TEXT,
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
		modelName: 'User',
		tableName: 'users',
		timestamps: false,
	}
);

export default User;
