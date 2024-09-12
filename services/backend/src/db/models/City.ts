import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Country from './Country';

export interface CityAttributes {
	id: number;
	name: string;
	countryId: number;
}

export type CityCreationAttributes = Optional<CityAttributes, 'id'>;

class City extends Model<CityAttributes, CityCreationAttributes> {
	public id!: number;
	public name!: string;
	public countryId!: number;
}

City.init(
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
		countryId: {
			allowNull: false,
			field: 'country_id',
			type: DataTypes.INTEGER,
			references: {
				model: 'countries',
				key: 'id',
			},
		},
	},
	{
		sequelize: dbConnect,
		modelName: 'City',
		tableName: 'cities',
		timestamps: false,
	}
);

City.hasOne(Country, {
	foreignKey: 'id',
	sourceKey: 'countryId',
	as: 'country',
});

Country.hasMany(City, {
	foreignKey: 'countryId',
	sourceKey: 'id',
	as: 'cities',
});

export default City;
