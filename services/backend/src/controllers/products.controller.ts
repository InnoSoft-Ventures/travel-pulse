import { Request, Response } from 'express';
// import Package from '../db/models/Package';
import { Op, Sequelize } from 'sequelize';
import Operator from '../db/models/Operator';
import Continent from '../db/models/Continent';
import {
	BadRequestException,
	errorResponse,
	HTTP_STATUS_CODES,
	successResponse,
} from '@travelpulse/middlewares';
import { RegionExplore, SOMETHING_WENT_WRONG } from '@travelpulse/interfaces';
import dbConnect from '../db';
import Package from '../db/models/Package';
import Country from '../db/models/Country';

/**
 * Retrieves a mixed collection of regional and global packages, aggregating data by continent.
 * For regional packages, it groups them by continent and provides the minimum price and sample data.
 * For global packages, it provides a single aggregated entry.
 *
 * The function performs two main queries:
 * 1. Regional packages: Groups by continent, gets min price, and sample data/amount
 * 2. Global packages: Gets aggregated data for all global packages
 */
export const getMultipleRegions = async (req: Request, res: Response) => {
	try {
		const { size } = req.query;

		// Get aggregated data for regional packages grouped by continent
		const regionalAggregations = await Package.findAll({
			attributes: [
				// Group by continent and get aggregate values
				[Sequelize.col('operator->continent.name'), 'name'],
				[Sequelize.fn('MIN', Sequelize.col('price')), 'price'],
				[Sequelize.fn('ANY_VALUE', Sequelize.col('data')), 'data'],
				[Sequelize.fn('ANY_VALUE', Sequelize.col('amount')), 'amount'],
				// [Sequelize.fn('MAX', Sequelize.col('amount')), 'amount'],
				// [Sequelize.fn('MAX', Sequelize.col('day')), 'days'],
				[
					Sequelize.fn(
						'ANY_VALUE',
						Sequelize.col('operator->continent.id')
					),
					'regionId',
				],
				[Sequelize.col('operator.id'), 'operatorId'],
			],
			include: [
				{
					model: Operator,
					as: 'operator',
					attributes: [],
					where: {
						type: 'regional',
					},
					include: [
						{
							model: Continent,
							as: 'continent',
							attributes: [],
							required: false,
						},
					],
					required: true,
				},
			],
			where: {
				'$operator->continent.name$': {
					[Op.not]: null,
				},
			},
			group: [
				'operator->continent.name',
				'operator->continent.id',
				'operator.id',
			],
			order: [[Sequelize.col('operator->continent.name'), 'ASC']],
			limit: size ? parseInt(size as string, 10) : undefined,
		});

		// Get aggregated data for global packages
		const globalAggregation = await Package.findAll({
			attributes: [
				[Sequelize.literal("'Global'"), 'name'],
				[Sequelize.fn('MIN', Sequelize.col('price')), 'price'],
				[Sequelize.fn('ANY_VALUE', Sequelize.col('data')), 'data'],
				[Sequelize.fn('ANY_VALUE', Sequelize.col('amount')), 'amount'],
				// [Sequelize.fn('MAX', Sequelize.col('amount')), 'amount'],
				// [Sequelize.fn('MAX', Sequelize.col('day')), 'days'],
				[Sequelize.literal('null'), 'regionId'],
				[Sequelize.col('operator.id'), 'operatorId'],
			],
			include: [
				{
					model: Operator,
					as: 'operator',
					attributes: [],
					where: {
						type: 'global',
					},
					required: true,
				},
			],
			group: ['operator.id'],
		});

		// Combine and format the results
		const results: RegionExplore[] = regionalAggregations.map(
			(agg: any) => ({
				name: agg.getDataValue('name'),
				operatorId: agg.getDataValue('operatorId'),
				regionId: agg.getDataValue('regionId'),
				price: agg.getDataValue('price'),
				data: agg.getDataValue('data'),
				amount: agg.getDataValue('amount'),
				type: 'regional',
			})
		);

		// Add the global aggregation result if it exists
		if (globalAggregation.length > 0) {
			const globalData: any = globalAggregation[0].get();
			results.push({
				name: globalData.name,
				operatorId: globalData.operatorId,
				regionId: globalData.regionId,
				price: globalData.price,
				data: globalData.data,
				amount: globalData.amount,
				type: 'global',
			});
		}

		res.status(HTTP_STATUS_CODES.OK).json(successResponse(results));
	} catch (error) {
		console.error('Error in getMixedRandomPackages', error);
		res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
			errorResponse(SOMETHING_WENT_WRONG)
		);
	}
};

/**
 * Returns the top 6 countries with the cheapest available package.
 *
 * For each country, finds the minimum package price (if any packages exist),
 * then sorts all countries by their cheapest package price in ascending order.
 * The response includes only the country name, flag, and the lowest price found.
 *
 * If no packages exist for a country, that country is excluded from the results.
 *
 * Example usage: For displaying 'Popular destinations' when real popularity data is unavailable.
 * This function is useful for showcasing countries with the best deals on packages,
 * giving users an idea of where they can find the cheapest options.
 * @TODO Get real popularity data to replace this placeholder logic.
 */
export const getPopularDestinations = async (req: Request, res: Response) => {
	try {
		const { size } = req.query;

		// Find the cheapest package for each country
		const [results] = await dbConnect.query(`
			SELECT c.name, c.flag, MIN(p.price) AS price
			FROM countries c
			JOIN operators o ON c.id = o.country_id
			JOIN packages p ON o.id = p.operator_id
			GROUP BY c.id, c.name, c.flag
			HAVING MIN(p.price) IS NOT NULL
			ORDER BY price ASC
			${size ? `LIMIT ${parseInt(size as string, 10)}` : ''};
		`);

		res.json(successResponse(results));
	} catch (error) {
		console.error('Error in getPopularDestinations', error);
		res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
	}
};

/**
 * Returns all local packages for a specific country, using the country slug.
 *
 * @returns List of operators with their local packages and coverage for the country.
 */
export const getLocalPackages = async (req: Request, res: Response) => {
	const { countrySlug } = req.params;

	try {
		// Find the country by slug using the Country model
		const country = await Country.findOne({ where: { slug: countrySlug } });
		if (!country) {
			return res.status(404).json(errorResponse('Country not found'));
		}

		// Fetch local packages for the country
		const localPackages = await Operator.findAll({
			where: {
				type: 'local',
				countryId: country.id,
			},
			attributes: ['id', 'title', 'type', 'esimType', 'apnType'],
			include: [
				{
					association: 'packages',
					attributes: [
						'title',
						'price',
						'amount',
						'day',
						'data',
						'isUnlimited',
					],
					order: [
						['price', 'ASC'],
						['amount', 'DESC'],
						['day', 'ASC'],
					],
				},
				{
					association: 'coverage',
					attributes: ['data'],
				},
			],
			order: [
				['packages', 'price', 'ASC'],
				['packages', 'amount', 'DESC'],
				['packages', 'day', 'ASC'],
			],
		});

		return res.json(successResponse(localPackages));
	} catch (error) {
		console.error('Error in getLocalPackages', error);
		return res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
	}
};

/**
 * Retrieves all packages for a specific region identified by its slug.
 * The function searches for the region in the continents table using the alias_list JSON column,
 * then returns all associated operators and their packages for that region.
 */
export const getRegionPackages = async (req: Request, res: Response) => {
	const { regionSlug } = req.params;

	try {
		const regionPackages = await Continent.findOne({
			where: dbConnect.literal(
				`alias_list::jsonb ? '${regionSlug.toLowerCase()}'`
			),
			attributes: ['id', 'name'],
			include: [
				{
					association: 'operators',
					attributes: ['id', 'title', 'type', 'esimType', 'apnType'],
					include: [
						{
							association: 'packages',
							attributes: [
								'title',
								'price',
								'amount',
								'day',
								'data',
								'isUnlimited',
							],
							order: [
								['price', 'ASC'],
								['amount', 'DESC'],
								['day', 'ASC'],
							],
						},
						{
							association: 'coverage',
							attributes: ['data'],
						},
					],
				},
			],
		});

		if (!regionPackages) {
			throw new BadRequestException('Region not found', null);
		}

		// Parse coverage data if it exists
		regionPackages.getDataValue('operators')?.forEach((operator) => {
			if (
				operator.coverage &&
				typeof operator.coverage.data === 'string'
			) {
				operator.coverage.data = JSON.parse(operator.coverage.data);
			}
		});

		return res
			.status(HTTP_STATUS_CODES.OK)
			.json(successResponse(regionPackages));
	} catch (error) {
		console.error('Error in getRegionPackages', error);

		if (error instanceof BadRequestException) {
			return res
				.status(HTTP_STATUS_CODES.BAD_REQUEST)
				.json(errorResponse(error.message));
		}

		return res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
	}
};

export const getGlobalPackages = async (_req: Request, res: Response) => {
	try {
		const globalPackages = await Operator.findAll({
			where: {
				type: 'global',
			},
			attributes: ['id', 'title', 'type', 'esimType', 'apnType'],
			include: [
				{
					association: 'packages',
					attributes: [
						'title',
						'price',
						'amount',
						'day',
						'data',
						'isUnlimited',
					],
				},
				{
					association: 'coverage',
					attributes: ['data'],
				},
			],
			order: [
				['packages', 'price', 'ASC'],
				['packages', 'amount', 'DESC'],
				['packages', 'day', 'ASC'],
			],
		});

		globalPackages.forEach((operator) => {
			if (
				operator.coverage &&
				typeof operator.coverage.data === 'string'
			) {
				operator.coverage.data = JSON.parse(operator.coverage.data);
			}
		});

		res.status(HTTP_STATUS_CODES.OK).json(successResponse(globalPackages));
	} catch (error) {
		console.error('Error in getGlobalPackages', error);

		res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
	}
};
