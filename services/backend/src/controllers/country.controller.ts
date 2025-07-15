import { Request, Response } from 'express';
import Country from '../db/models/Country';
import { Op, Sequelize, col, fn } from 'sequelize';
import { errorResponse, successResponse } from '@travelpulse/middlewares';
import Continent from '../db/models/Continent';
import dbConnect from '../db';
import Operator from '../db/models/Operator';
import Package from '../db/models/Package';

export const getCountries = async (_req: Request, res: Response) => {
	try {
		const countries = await Country.findAll({
			attributes: [
				'id',
				'name',
				'slug',
				'iso2',
				'iso3',
				'timezone',
				'flag',
				'demonym',
				'currencyName',
				'currencySymbol',
			],
		});

		return res.status(200).json(successResponse(countries));
	} catch (error) {
		console.error('Error fetching countries:', error);
		return res.status(500).json(errorResponse('Internal Server Error'));
	}
};

export const countrySearch = async (req: Request, res: Response) => {
	try {
		const searchQuery = String(req.query.query || '').trim();
		let matchType = String(req.query.matchType || '').trim();

		let countryNameQuery = {};

		// Return country that matches exactly this search query otherwise nothing.
		if (matchType === 'exact') {
			countryNameQuery = Sequelize.where(
				dbConnect.fn('lower', dbConnect.col('name')),
				Op.eq,
				searchQuery.toLowerCase()
			);
		} else {
			countryNameQuery = {
				name: {
					[Op.iLike]: `%${searchQuery}%`,
				},
			};
		}

		if (!searchQuery) {
			return res
				.status(400)
				.json(errorResponse('Search term is required'));
		}

		const countries = await Country.findAll({
			where: countryNameQuery,
			include: [
				{
					model: Operator,
					as: 'operators',
					attributes: [],
					required: false,
					include: [
						{
							model: Package,
							as: 'packages',
							attributes: [],
							required: false,
						},
					],
				},
			],
			attributes: {
				include: [
					[
						fn('MIN', col('operators->packages.price')),
						'cheapestPackagePrice',
					],
				],
			},
			group: ['Country.id'],
		});

		return res.status(200).json(successResponse(countries));
	} catch (error) {
		console.error('Error fetching countries:', error);
		return res.status(500).json(errorResponse('Internal Server Error'));
	}
};

export const getRegions = async (req: Request, res: Response) => {
	try {
		const size = Number(req.query.size) || 8; // Default to 8 if not provided

		const regions = await Continent.findAll({
			attributes: ['id', 'name', 'aliasList'],
			order: [['name', 'ASC']],
			limit: size,
		});

		const data = regions.map((region) => ({
			id: region.id,
			name: region.name,
			slug: region.aliasList[0],
			aliasList: region.aliasList,
		}));
		return res.status(200).json(successResponse(data));
	} catch (error) {
		console.error('Error fetching regions:', error);
		return res.status(500).json(errorResponse('Internal Server Error'));
	}
};

export const getRegion = async (req: Request, res: Response) => {
	try {
		const { regionSlug } = req.params;

		const region = await Continent.findOne({
			where: dbConnect.literal(
				`alias_list::jsonb ? '${regionSlug.toLowerCase()}'`
			),
			include: [
				{
					model: Operator,
					as: 'operators',
					attributes: [],
					required: false,
					include: [
						{
							model: Package,
							as: 'packages',
							attributes: [],
							required: false,
						},
					],
				},
			],
			attributes: {
				include: [
					[
						fn('MIN', col('operators->packages.price')),
						'cheapestPackagePrice',
					],
				],
			},
			group: ['Continent.id', 'operators.id', 'operators->packages.id'],
			subQuery: false,
		});

		if (!region) {
			return res.status(404).json(errorResponse('Region not found'));
		}

		return res.status(200).json(successResponse(region));
	} catch (error) {
		console.error('Error fetching region:', error);
		return res.status(500).json(errorResponse('Internal Server Error'));
	}
};

export const getPopularCountries = async (_req: Request, res: Response) => {
	try {
		const limit = 18;

		const countries = await Country.findAll({
			attributes: [
				'id',
				'name',
				'slug',
				'iso2',
				'iso3',
				'timezone',
				'flag',
				'demonym',
				'currencyName',
				'currencySymbol',
			],
			order: [Sequelize.literal('RANDOM()')],
			limit,
		});

		return res.status(200).json(successResponse(countries));
	} catch (error) {
		console.error('Error fetching popular countries:', error);
		return res.status(500).json(errorResponse('Internal Server Error'));
	}
};
