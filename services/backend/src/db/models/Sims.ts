import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import ProviderOrder from './ProviderOrder';
import { ApnType, SimStatus } from '@travelpulse/interfaces';

type SimAPNSettings = {
	[key: string]: {
		apn_type: string;
		apn_value: string | null;
	};
};

export interface SimAttributes {
	id: number;
	providerOrderId: number;
	iccid: string;
	lpa: string;
	name: string | null;
	imsis: string | null;
	matchingId: string;
	qrcode: string;
	qrcodeUrl: string;
	code: string | null;
	apnType: ApnType;
	apnValue: string | null;
	isRoaming: boolean;
	confirmationCode: string | null;
	apn: SimAPNSettings | null;
	msisdn: string | null;
	directAppleInstallationUrl: string;
	remaining: number;
	total: number;
	expiredAt: Date;
	isUnlimited: boolean;
	status: SimStatus;
	remainingVoice: number;
	remainingText: number;
	totalVoice: number;
	totalText: number;
	lastUsageFetchAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export type SimCreationAttributes = Optional<
	SimAttributes,
	'id' | 'expiredAt' | 'createdAt' | 'updatedAt' | 'name' | 'lastUsageFetchAt'
>;

class Sim extends Model<SimAttributes, SimCreationAttributes> {
	public id!: number;
	public providerOrderId!: number;
	public iccid!: string;
	public imsis!: string | null;
	public name!: string | null;
	public lpa!: string;
	public matchingId!: string;
	public qrcode!: string;
	public qrcodeUrl!: string;
	public code!: string | null;
	public apnType!: ApnType;
	public apnValue!: string | null;
	public isRoaming!: boolean;
	public confirmationCode!: string | null;
	public apn!: SimAPNSettings | null;
	public msisdn!: string | null;
	public directAppleInstallationUrl!: string;
	public remaining!: number;
	public total!: number;
	public expiredAt!: Date;
	public isUnlimited!: boolean;
	public status!: SimStatus;
	public remainingVoice!: number;
	public remainingText!: number;
	public totalVoice!: number;
	public totalText!: number;
	public lastUsageFetchAt!: Date | null;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Sim.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		providerOrderId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'provider_order_id',
			references: {
				model: ProviderOrder,
				key: 'id',
			},
		},
		name: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		iccid: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		lpa: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		imsis: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		matchingId: {
			allowNull: false,
			field: 'matching_id',
			type: DataTypes.STRING,
		},
		qrcode: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		qrcodeUrl: {
			allowNull: false,
			field: 'qrcode_url',
			type: DataTypes.TEXT,
		},
		code: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		apnType: {
			allowNull: false,
			field: 'apn_type',
			type: DataTypes.STRING,
		},
		apnValue: {
			allowNull: true,
			field: 'apn_value',
			type: DataTypes.STRING,
		},
		isRoaming: {
			allowNull: false,
			field: 'is_roaming',
			type: DataTypes.BOOLEAN,
		},
		confirmationCode: {
			allowNull: true,
			field: 'confirmation_code',
			type: DataTypes.STRING,
		},
		apn: {
			allowNull: true,
			type: DataTypes.JSON,
		},
		msisdn: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		directAppleInstallationUrl: {
			allowNull: false,
			type: DataTypes.TEXT,
			field: 'direct_apple_installation_url',
		},
		remaining: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		total: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		expiredAt: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'expired_at',
		},
		isUnlimited: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
			field: 'is_unlimited',
		},
		status: {
			allowNull: false,
			type: DataTypes.STRING,
			defaultValue: SimStatus.NOT_ACTIVE,
		},
		remainingVoice: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'remaining_voice',
			defaultValue: 0,
		},
		remainingText: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'remaining_text',
			defaultValue: 0,
		},
		totalVoice: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'total_voice',
			defaultValue: 0,
		},
		totalText: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'total_text',
			defaultValue: 0,
		},
		lastUsageFetchAt: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'last_usage_fetch_at',
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
		modelName: 'Sim',
		tableName: 'sims',
		timestamps: false,
	}
);

Sim.belongsTo(ProviderOrder, {
	foreignKey: 'providerOrderId',
	as: 'providerOrder',
});

ProviderOrder.hasMany(Sim, {
	foreignKey: 'providerOrderId',
	as: 'sims',
});

// PackageHistory association will be set up in PackageHistory model
// to avoid circular dependency issues

export default Sim;
