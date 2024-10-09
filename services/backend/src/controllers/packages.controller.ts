import { Request, Response } from 'express';
import Package from '../db/models/Package';

export const getAllPackages = async (_req: Request, res: Response) => {
	try {
		const type = 'local';

		const packages = await Package.findAll({
			// where: {
			// 	type,
			// },
			include: [
				{
					association: 'operator',
					attributes: ['title', 'type', 'esim_type', 'id'],
					where: {
						type,
					},
				},
			],
			order: [
				['price', 'ASC'],
				['amount', 'DESC'],
				['day', 'DESC'],
			],
			limit: 2,
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
