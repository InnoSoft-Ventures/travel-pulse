import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';
import { Response } from 'express';
import { createOrderService } from '../services/orders.service';
import { SessionRequest } from '../../types/express';

export const makeOrder = async (req: SessionRequest, res: Response) => {
	const orderResponse = await createOrderService(req);

	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(orderResponse, 'Order created successfully')
	);
};
