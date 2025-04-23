import { Request, Response } from 'express';
import Country from '../db/models/Country';
import { Op } from 'sequelize';
import { errorResponse, successResponse } from '@travelpulse/middlewares';

export const getCountries = async (_req: Request, res: Response) => {
	try {
		const countries = await Country.findAll({
			attributes: [
				'id',
				'name',
				'iso2',
				'iso3',
				'timezone',
				'flag',
				'demonym',
				'currencyName',
				'currencySymbol',
			],
			order: [['name', 'ASC']],
			// include: {
			// 	model: Country,
			// 	as: 'continent',
			// 	attributes: ['id', 'name'],
			// },
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

		return res.status(200).json(countries);
	} catch (error) {
		console.error('Error fetching countries:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getCountry = async (_req: Request, res: Response) => {
	try {
		// const { country } = req.params;
		// const countries = await fetchCountriesFromAPI();

		// if (country) {
		// 	const filteredCountries = countries.filter((c) =>
		// 		c.name.toLowerCase().includes(country.toLowerCase())
		// 	);
		// 	return res.status(200).json(filteredCountries);
		// }

		return res.status(200).json([]);
	} catch (error) {
		console.error('Error fetching countries:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};
