import { successResponse } from '@libs/middlewares';
import { Airalo } from '@libs/providers';
import { Request, Response } from 'express';

export const optIn = async (req: Request, res: Response) => {
	const airalo = Airalo.getInstance();

	res.json(
		successResponse(await airalo.optIn(req.body), 'Opt-in successful')
	);
};

export const asyncOrders = async (req: Request, res: Response) => {
	console.log('AsyncOrders async order:', req.body);
	console.log('AsyncOrders', req.headers);

	res.json(successResponse(null, 'Order received'));
};
