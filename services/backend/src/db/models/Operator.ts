import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Country from './Country';
import Continent from './Continent';

export interface OperatorAttributes {
	id: number;
	externalId: number;
	provider: string;
	countryId: number;
	continentId: number;
	title: string;
	type: string;
	isPrepaid: boolean;
	esimType: string;
	warning: string | null;
	apnType: string;
	apnValue: string | null;
	apn: Record<string, { apn_type: string; apn_value: string | null }>;
	isRoaming: boolean;
	planType: string;
	activationPolicy: string;
	isKycVerify: boolean;
	rechargeability: boolean;
	otherInfo: string;
	info: string[];
	createdAt: Date;
	updatedAt: Date;
}

export type OperatorCreationAttributes = Optional<
	OperatorAttributes,
	'id' | 'createdAt' | 'updatedAt'
>;

class Operator extends Model<OperatorAttributes, OperatorCreationAttributes> {
	public id!: number;
	public externalId!: number;
	public provider!: string;
	public countryId!: number;
	public continentId!: number;
	public title!: string;
	public type!: string;
	public isPrepaid!: boolean;
	public esimType!: string;
	public warning!: string;
	public apnType!: string;
	public apnValue!: string;
	public apn!: string;
	public info!: string;
	public isRoaming!: boolean;
	public planType!: string;
	public activationPolicy!: string;
	public isKycVerify!: boolean;
	public rechargeability!: boolean;
	public otherInfo!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Operator.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		externalId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'external_id',
		},
		countryId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			references: {
				model: 'countries',
				key: 'id',
			},
			field: 'country_id',
		},
		continentId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			references: {
				model: 'continents',
				key: 'id',
			},
			field: 'continent_id',
		},
		provider: {
			allowNull: false,
			type: DataTypes.STRING(100),
		},
		title: {
			allowNull: false,
			type: DataTypes.STRING(255),
		},
		type: {
			allowNull: true,
			type: DataTypes.STRING(50),
		},
		isPrepaid: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
			field: 'is_prepaid',
		},
		esimType: {
			allowNull: true,
			type: DataTypes.STRING(50),
			field: 'esim_type',
		},
		warning: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
		apnType: {
			allowNull: true,
			type: DataTypes.STRING(50),
			field: 'apn_type',
		},
		apnValue: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'apn_value',
		},
		apn: {
			allowNull: false,
			type: DataTypes.JSON,
		},
		info: {
			allowNull: false,
			type: DataTypes.JSON,
		},
		isRoaming: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
			field: 'is_roaming',
		},
		planType: {
			allowNull: true,
			type: DataTypes.STRING(50),
			field: 'plan_type',
		},
		activationPolicy: {
			allowNull: true,
			type: DataTypes.STRING(50),
			field: 'activation_policy',
		},
		isKycVerify: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
			field: 'is_kyc_verify',
		},
		rechargeability: {
			allowNull: true,
			type: DataTypes.BOOLEAN,
		},
		otherInfo: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'other_info',
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
		modelName: 'Operator',
		tableName: 'operators',
		timestamps: false,
	}
);

// Define the relationship between Operator and Country
Operator.belongsTo(Country, {
	foreignKey: 'countryId',
	as: 'country',
});

Operator.belongsTo(Continent, {
	foreignKey: 'continentId',
	as: 'continent',
});

Country.hasMany(Operator, {
	foreignKey: 'countryId',
	as: 'operators',
});

Continent.hasMany(Operator, {
	foreignKey: 'continentId',
	as: 'operators',
});

export default Operator;
