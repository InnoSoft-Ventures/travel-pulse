import { ProviderIdentity } from '@travelpulse/interfaces';
import { successResponse } from '@travelpulse/middlewares';
import { Request, Response } from 'express';
import { processAsyncOrders } from '../services/process-async-orders';
import { optingAiraloService } from '../services/webhooks/airalo/airalo-notifications';
import { handlePaystackWebhook } from '../services/webhooks/payments/paystack.webhook';

export const optIn = async (req: Request, res: Response) => {
	const data = await optingAiraloService('opt-in', req.body);

	res.json(successResponse(data, 'Opt-in successful'));
};

export const optOut = async (req: Request, res: Response) => {
	const data = await optingAiraloService('opt-out', req.body);

	res.json(successResponse(data, 'Opt-out successful'));
};

export const notificationDetails = async (req: Request, res: Response) => {
	const data = await optingAiraloService('notification-details', req.body);

	res.json(
		successResponse(data, 'Notification details retrieved successfully')
	);
};

export const webhookAiraloSimulator = async (req: Request, res: Response) => {
	const data = await optingAiraloService('simulator', req.body);

	res.json(successResponse(data, 'Simulator triggered successfully'));
};

export const webhookAiraloLowData = async (req: Request, res: Response) => {
	// const data = await optingAiraloService('low-data', req.body);
	console.log('Low data notification received');
	console.log(req.body);

	res.json(
		successResponse('data', 'Low data notification triggered successfully')
	);
};

export const asyncOrders = (provider: ProviderIdentity) => {
	return async (req: Request, res: Response) => {
		await processAsyncOrders(provider, req.body);

		res.json(successResponse(null, 'Order received'));
	};
};

export const paystackWebhook = async (req: Request, res: Response) => {
	const data = await handlePaystackWebhook(req);

	res.json(successResponse(data, 'Paystack webhook processed successfully'));
};
