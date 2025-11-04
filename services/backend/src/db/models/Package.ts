import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import { PackageType, ProviderIdentity } from '@travelpulse/interfaces';
import Operator from './Operator';

export interface PackageAttributes {
	id: number;
	provider: ProviderIdentity;
	operatorId: number;
	externalPackageId: string;
	/** This could be sim or data */
	type: PackageType;
	title: string;
	price: number;
	amount: number;
	day: number;
	isUnlimited: boolean;
	data: string;
	shortInfo: string | null;
	qrInstallation: string | null;
	manualInstallation: string | null;
	voice: number | null;
	text: number | null;
	netPrice: number | null;
	createdAt: Date;
	updatedAt: Date;
	operator?: Operator;
}

export type PackageLite = Pick<
	Package,
	| 'id'
	| 'price'
	| 'type'
	| 'amount'
	| 'voice'
	| 'text'
	| 'externalPackageId'
	| 'provider'
> & { quantity: number };

export type PackageCreationAttributes = Optional<
	PackageAttributes,
	'id' | 'createdAt' | 'updatedAt'
>;

class Package extends Model<PackageAttributes, PackageCreationAttributes> {
	public id!: number;
	public operatorId!: number;
	public provider!: ProviderIdentity;
	public externalPackageId!: string;
	public type!: PackageType;
	public title!: string;
	public price!: number;
	public amount!: number;
	public day!: number;
	public isUnlimited!: boolean;
	public data!: string;
	public shortInfo!: string;
	public qrInstallation!: string;
	public manualInstallation!: string;
	public voice!: number;
	public text!: number;
	public netPrice!: number;

	public operator?: Operator;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Package.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		operatorId: {
			allowNull: false,
			type: DataTypes.BIGINT,
			field: 'operator_id',
			references: {
				model: Operator,
				key: 'id',
			},
		},
		provider: {
			allowNull: false,
			type: DataTypes.STRING(100),
		},
		externalPackageId: {
			allowNull: false,
			field: 'external_package_id',
			type: DataTypes.STRING(255),
		},
		type: {
			allowNull: true,
			type: DataTypes.STRING(50),
		},
		title: {
			allowNull: false,
			type: DataTypes.STRING(255),
		},
		price: {
			allowNull: false,
			type: DataTypes.DECIMAL(10, 2),
		},
		amount: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		day: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		isUnlimited: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
			field: 'is_unlimited',
		},
		data: {
			allowNull: true,
			type: DataTypes.STRING(50),
		},
		shortInfo: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'short_info',
		},
		qrInstallation: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'qr_installation',
		},
		manualInstallation: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'manual_installation',
		},
		voice: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		text: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		netPrice: {
			allowNull: true,
			type: DataTypes.DECIMAL(10, 2),
			field: 'net_price',
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
		modelName: 'Package',
		tableName: 'packages',
		timestamps: false,
	}
);

export default Package;
