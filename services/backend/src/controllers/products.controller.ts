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

export const getMultipleRegions = async (_req: Request, res: Response) => {
	try {
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
			limit: 8,
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

export const getRegionPackages = async (req: Request, res: Response) => {
	const { regionSlug } = req.params;

	try {
		const regionPackages = await Continent.findOne({
			// @ts-ignore
			where: dbConnect.where(
				dbConnect.fn(
					'JSON_CONTAINS',
					dbConnect.col('alias_list'),
					dbConnect.literal(`'"${regionSlug}"'`)
				),
				true
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
						},
						{
							association: 'coverage',
							attributes: ['data'],
						},
					],
				},
			],
			order: [
				['operators', 'packages', 'price', 'ASC'],
				['operators', 'packages', 'amount', 'DESC'],
				['operators', 'packages', 'day', 'ASC'],
			],
		});

		if (!regionPackages) {
			throw new BadRequestException('Region not found', null);
		}

		regionPackages.getDataValue('operators')?.forEach((operator) => {
			if (
				operator.coverage &&
				typeof operator.coverage.data === 'string'
			) {
				operator.coverage.data = JSON.parse(operator.coverage.data);
			}
		});

		res.status(HTTP_STATUS_CODES.OK).json(successResponse(regionPackages));
	} catch (error) {
		console.error('Error in getRegionPackages', error);

		res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
	}
};

export const getPopularDestinations = async (_req: Request, res: Response) => {
	try {
	} catch (error) {
		console.error('Error in getPopularDestinations', error);
		res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
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
