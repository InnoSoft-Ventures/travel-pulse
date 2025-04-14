import { errorResponse } from '@travelpulse/middlewares';
import { secureAiraloWebhook } from '@travelpulse/providers';
import { NextFunction, Request, Response } from 'express';

export const secureWebhookMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
