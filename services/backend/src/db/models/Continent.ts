import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';

export interface ContinentAttributes {
	id: number;
	name: string;
	aliasList: string[];
}

export type ContinentCreationAttributes = Optional<ContinentAttributes, 'id'>;

class Continent extends Model<
	ContinentAttributes,
	ContinentCreationAttributes
> {
	public id!: number;
	public name!: string;
	public aliasList!: string[];
}

Continent.init(
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
		aliasList: {
			allowNull: false,
			field: 'alias_list',
			type: DataTypes.JSON,
		},
	},
	{
		sequelize: dbConnect,
		timestamps: false,
		modelName: 'Continent',
		tableName: 'continents',
	}
);

export default Continent;
