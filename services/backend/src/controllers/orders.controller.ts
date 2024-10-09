import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';
import { Request, Response } from 'express';
import { createOrderService } from '../services/orders.service';

export const makeOrder = async (req: Request, res: Response) => {
	const orderResponse = await createOrderService(req);

	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(orderResponse, 'Order created successfully')
	);
};
