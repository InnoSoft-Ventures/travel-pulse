import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Continent from './Continent';

export interface CountryAttributes {
	id: number;
	name: string;
	slug: string;
	officialName: string;
	iso2: string;
	iso3: string;
	timezone: string;
	flag: string;
	demonym: string;
	currencyName: string;
	currencySymbol: string;
	continentId: number;
}

export type CountryCreationAttributes = Optional<CountryAttributes, 'id'>;

class Country extends Model<CountryAttributes, CountryCreationAttributes> {
	public id!: number;
	public name!: string;
	public slug!: string;
	public officialName!: string;
	public iso2!: string;
	public iso3!: string;
	public timezone!: string;
	public flag!: string;
	public demonym!: string;
	public currencyName!: string;
	public currencySymbol!: string;
	public continentId!: number;
}

Country.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		slug: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
		},
		officialName: {
			allowNull: false,
			field: 'official_name',
			type: DataTypes.STRING,
		},
		iso2: {
			allowNull: false,
			type: DataTypes.STRING(2),
		},
		iso3: {
			allowNull: false,
			type: DataTypes.STRING(3),
		},
		timezone: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		flag: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		demonym: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		currencyName: {
			allowNull: false,
			field: 'currency_name',
			type: DataTypes.STRING,
		},
		currencySymbol: {
			allowNull: false,
			field: 'currency_symbol',
			type: DataTypes.STRING,
		},
		continentId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'continent_id',
			references: {
				model: 'continents',
				key: 'id',
			},
		},
	},
	{
		sequelize: dbConnect,
		modelName: 'Country',
		timestamps: false,
		tableName: 'countries',
	}
);

Country.hasOne(Continent, {
	foreignKey: 'id',
	sourceKey: 'continentId',
	as: 'continent',
});

Continent.hasMany(Country, {
	foreignKey: 'continentId',
	sourceKey: 'id',
	as: 'countries',
});

export default Country;
