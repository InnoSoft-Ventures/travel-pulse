import { ProviderIdentity } from '@travelpulse/interfaces';
import { successResponse } from '@travelpulse/middlewares';
import { Airalo } from '@travelpulse/providers';
import { Request, Response } from 'express';
import { processAsyncOrders } from '../services/process-async-orders';

export const optIn = async (req: Request, res: Response) => {
	const airalo = Airalo.getInstance();

	res.json(
		successResponse(await airalo.optIn(req.body), 'Opt-in successful')
	);
};

export const asyncOrders = (provider: ProviderIdentity) => {
	return async (req: Request, res: Response) => {
		await processAsyncOrders(provider, req.body);

		res.json(successResponse(null, 'Order received'));
	};
};
