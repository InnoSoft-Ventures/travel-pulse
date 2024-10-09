import { Request, Response } from 'express';
import Package from '../db/models/Package';

export const getAllPackages = async (_req: Request, res: Response) => {
	try {
		const packages = await Package.findAll({
			where: {},
			order: [
				['price', 'ASC'],
				['amount', 'DESC'],
				['day', 'DESC'],
			],
		});

		// const packagesWithPrices = packages.map((pkg) => {
		// 	const { price, ...rest } = pkg.toJSON();
		// 	return {
		// 		...rest,
		// 		price: price.toFixed(2),
		// 	};
		// });

		res.status(200).json(packages);
	} catch (error) {
		res.status(500).json({ message: 'error.message' });
	}
};
