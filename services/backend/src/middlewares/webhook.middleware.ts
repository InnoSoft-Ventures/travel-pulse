import { errorResponse } from '@libs/middlewares';
import { secureAiraloWebhook } from '@libs/providers';
import { NextFunction, Request, Response } from 'express';

export const secureWebhookMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log('Received async order:', req.body);
	console.log('Headers', req.headers);

	if (
		!secureAiraloWebhook(
			req.body,
			req.headers['airalo-signature'] as string
		)
	) {
		return res
			.status(401)
			.json(errorResponse('Insecure webhook connection'));
	}

	return next();
};
