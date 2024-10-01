import { Model, DataTypes, Optional } from 'sequelize';
import dbConnect from '..';
import Operator from './Operator';
import { AiraloCoverage } from '@libs/providers';

export interface CoverageAttributes {
	id: number;
	operatorId: number;
	data: AiraloCoverage[];
}

export type CoverageCreationAttributes = Optional<CoverageAttributes, 'id'>;

class Coverage extends Model<CoverageAttributes, CoverageCreationAttributes> {
	public id!: number;
	public operatorId!: number;
	public data!: AiraloCoverage[];
}

Coverage.init(
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
				model: 'operators',
				key: 'id',
			},
		},
		data: {
			allowNull: true,
			type: DataTypes.JSON,
		},
	},
	{
		sequelize: dbConnect,
		modelName: 'Coverage',
		tableName: 'coverages',
		timestamps: false,
	}
);

// Define the relationship between Coverage and Operator
Operator.hasOne(Coverage, {
	foreignKey: 'operatorId',
	as: 'coverage',
});

Coverage.belongsTo(Operator, {
	foreignKey: 'operatorId',
	as: 'operator',
});

export default Coverage;
