import { successResponse } from '@libs/middlewares';
import { Request, Response } from 'express';

export const makeOrder = async (_req: Request, res: Response) => {
	// const { body } = req;
	// const { user } = req;

	res.json(successResponse('order', 'Order created successfully'));
};
