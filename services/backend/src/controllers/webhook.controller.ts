import { ProviderIdentity } from '@travelpulse/interfaces';
import { errorResponse, successResponse } from '@travelpulse/middlewares';
import { Airalo } from '@travelpulse/providers';
import { Request, Response } from 'express';
import { processAsyncOrders } from '../services/process-async-orders';
import { providerTokenHandler } from '../services/provider-token.service';
import dbConnect from '../db';

export const optIn = async (req: Request, res: Response) => {
	const transact = await dbConnect.transaction();

	try {
		const token = await providerTokenHandler(transact)(
			ProviderIdentity.AIRALO
		);
		const airalo = Airalo.getInstance(token);

		await transact.commit();

		res.json(
			successResponse(await airalo.optIn(req.body), 'Opt-in successful')
		);
	} catch (error) {
		await transact.rollback();

		console.error('Error during opt-in:', error);
		res.status(500).json(errorResponse('Failed to opt-in'));
	}
};

export const optOut = async (req: Request, res: Response) => {
	const transact = await dbConnect.transaction();

	try {
		const token = await providerTokenHandler(transact)(
			ProviderIdentity.AIRALO
		);
		const airalo = Airalo.getInstance(token);

		await transact.commit();

		res.json(
			successResponse(await airalo.optOut(req.body), 'Opt-out successful')
		);
	} catch (error) {
		await transact.rollback();

		console.error('Error during opt-out:', error);
		res.status(500).json(errorResponse('Failed to opt-out'));
	}
};

export const asyncOrders = (provider: ProviderIdentity) => {
	return async (req: Request, res: Response) => {
		await processAsyncOrders(provider, req.body);

		res.json(successResponse(null, 'Order received'));
	};
};
