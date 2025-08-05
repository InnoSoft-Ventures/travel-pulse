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
import {
	PackageResults,
	RegionExplore,
	SOMETHING_WENT_WRONG,
} from '@travelpulse/interfaces';
import dbConnect from '../db';
import Package from '../db/models/Package';
import Country from '../db/models/Country';
import { ProductSearch } from '../schema/product.schema';
import {
	calculateTravelDays,
	capitalizeFirstLetter,
	dateJs,
} from '@travelpulse/utils';
import { constructPackageDetails } from '../utils/data';

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
				[Sequelize.col('operator->continent.alias_list'), 'aliasList'],
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
			(agg: any) => {
				const aliasList = agg.getDataValue('aliasList');

				return {
					name: agg.getDataValue('name'),
					operatorId: agg.getDataValue('operatorId'),
					regionId: agg.getDataValue('regionId'),
					price: agg.getDataValue('price'),
					data: agg.getDataValue('data'),
					amount: agg.getDataValue('amount'),
					type: 'regional',
					slug: aliasList[0],
					aliasList,
				};
			}
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
				slug: 'global',
				aliasList: ['global'],
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

/**
 * Retrieves all global packages available in the system.
 * Global packages are those that are not tied to a specific country or region.
 * The function fetches operators of type 'global' and their associated packages and coverage data.
 *
 * @TODO Still need to implement proper SQL query to fetch global packages.
 */
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

async function findInstanceIdBySlug(
	slug: string,
	targetDestination: ProductSearch['targetDestination']
): Promise<number | undefined> {
	switch (targetDestination) {
		case 'local':
			const countryObj = await Country.findOne({
				where: { slug },
			});
			return countryObj?.id;
		case 'regional':
			const continentObj = await Continent.findOne({
				where: dbConnect.literal(
					`alias_list::jsonb ? '${slug.toLowerCase()}'`
				),
			});
			return continentObj?.id;
		case 'global':
			return 0;
		default:
			throw new BadRequestException('Invalid target destination', {});
	}
}

function determineQueryObj(
	targetDestination: ProductSearch['targetDestination'],
	instanceId: number
) {
	let queryObj: {
		continentId?: number;
		countryId?: number;
		type: ProductSearch['targetDestination'];
	} = {
		type: targetDestination,
	};

	switch (targetDestination) {
		case 'local':
			queryObj = {
				...queryObj,
				countryId: instanceId,
			};
			break;
		case 'regional':
			queryObj = {
				...queryObj,
				continentId: instanceId,
			};
			break;
		case 'global':
			queryObj = {
				...queryObj,
				type: 'global',
			};
			break;
	}

	return queryObj;
}

/**
 * Returns all local packages for a specific query, using the provided slug.
 * @returns
 */
export const searchProducts = async (req: Request, res: Response) => {
	const {
		query,
		targetDestination,
		from: start,
		to: end,
	} = req.query as ProductSearch;

	const queryString = query.toLowerCase();
	const instanceId = await findInstanceIdBySlug(
		queryString,
		targetDestination as ProductSearch['targetDestination']
	);

	if (typeof instanceId === 'undefined') {
		return res
			.status(404)
			.json(
				errorResponse(
					`${capitalizeFirstLetter(targetDestination)} instance not found`
				)
			);
	}

	// Calculate the number of travel days (inclusive)
	const startDate = dateJs(start);
	const endDate = dateJs(end);
	const travelDuration = calculateTravelDays(startDate, endDate);

	// Query operators and their packages
	const operators = await Operator.findAll({
		where: determineQueryObj(targetDestination, instanceId),
		attributes: [
			'id',
			'title',
			'type',
			'esimType',
			'planType',
			'activationPolicy',
			'rechargeability',
			'isKycVerify',
			'info',
			'otherInfo',
		],
		include: [
			{
				association: 'packages',
				attributes: [
					'id',
					'title',
					'price',
					'amount',
					'day',
					'data',
					'isUnlimited',
				],
				where: {
					[Op.or]: [
						{ day: { [Op.gte]: travelDuration } },
						{ isUnlimited: true },
					],
				},
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

	const results: PackageResults = {
		packages: [],
		destinationType: targetDestination,
		travelDuration,
	};

	// Flatten packages and attach operator info, including additional features
	const [packages] = await Promise.all(
		operators.flatMap(async (operator) => {
			return await constructPackageDetails(operator);
		})
	);

	if (packages) {
		results.packages = packages.filter((pkg) => Boolean(pkg));
	}

	return res.json(successResponse(results));
};
