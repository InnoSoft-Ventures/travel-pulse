import { Request, Response } from 'express';
// import Package from '../db/models/Package';
import { Op } from 'sequelize';
import Operator from '../db/models/Operator';
import Continent from '../db/models/Continent';
import {
	BadRequestException,
	errorResponse,
	HTTP_STATUS_CODES,
	successResponse,
} from '@travelpulse/middlewares';
import { SOMETHING_WENT_WRONG } from '@travelpulse/interfaces';
import dbConnect from '../db';

export const getMultipleRegions = async (_req: Request, res: Response) => {
	try {
		const queryPackageType = 'local';

		const regions = await Operator.findAll({
			where: {
				type: {
					[Op.ne]: queryPackageType,
				},
			},
			attributes: [
				'id',
				'title',
				'type',
				'esimType',
				'apnType',
				'esimType',
			],
			include: [
				{
					association: 'continent',
					attributes: ['name'],
				},
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
					limit: 3,
					order: [
						['price', 'ASC'],
						['amount', 'DESC'],
						['day', 'ASC'],
					],
				},
			],
		});

		const packagesWithPrices = regions.map((region) => {
			const continentName = region.getDataValue('continent')?.name;
			const packageItem = region.getDataValue('packages');

			return {
				id: region.id,
				title: region.title,
				type: region.type,
				esimType: region.esimType,
				apnType: region.apnType,
				continentName,
				package: packageItem,
			};
		});

		res.status(200).json(successResponse(packagesWithPrices));
	} catch (error) {
		console.log('Error in getMultipleRegions', error);

		res.status(500).json(errorResponse(SOMETHING_WENT_WRONG));
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
