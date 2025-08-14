import { Request, Response } from 'express';

import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';
import { Cart } from '@travelpulse/interfaces/schemas/cart.schema';
import { processCartService } from '../services/cart.service';

export const processCart = async (req: Request, res: Response) => {
	const cart: Cart = req.body;
	const orderDetails = await processCartService(cart);

	res.status(HTTP_STATUS_CODES.OK).json(successResponse(orderDetails));
};
