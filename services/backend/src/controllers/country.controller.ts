import { Request, Response } from 'express';
import Country from '../db/models/Country';
import { Op, Sequelize } from 'sequelize';
import { errorResponse, successResponse } from '@travelpulse/middlewares';
import Continent from '../db/models/Continent';

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

		if (!searchQuery) {
			return res
				.status(400)
				.json(errorResponse('Search term is required'));
		}

		const countries = await Country.findAll({
			where: {
				name: {
					[Op.iLike]: `%${searchQuery}%`,
				},
			},
		});

		return res.status(200).json(successResponse(countries));
	} catch (error) {
		console.error('Error fetching countries:', error);
		return res.status(500).json(errorResponse('Internal Server Error'));
	}
};

export const getRegions = async (_req: Request, res: Response) => {
	try {
		const regions = await Continent.findAll({
			attributes: ['id', 'name', 'aliasList'],
			order: [['name', 'ASC']],
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
