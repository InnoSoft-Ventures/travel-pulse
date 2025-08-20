import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';
import { Response } from 'express';
import { createOrderService } from '../services/orders/create-orders.service';
import { SessionRequest } from '../../types/express';
import { getOrdersService } from '../services/orders/order-details.service';

export const makeOrder = async (req: SessionRequest, res: Response) => {
	const orderResponse = await createOrderService(req);

	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(orderResponse, 'Order created successfully')
	);
};

export const getOrders = async (req: SessionRequest, res: Response) => {
	const orders = await getOrdersService(req);

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(orders, 'Orders retrieved successfully')
	);
};
