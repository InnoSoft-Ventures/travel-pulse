import { UnprocessableEntity } from './../exceptions/validation';

import { NextFunction, Request, Response } from 'express';
import { z, ZodTypeAny } from 'zod';
import { errorHandler } from '../exceptions';

export const resourceId = (req: Request, res: Response, next: NextFunction) => {
	errorHandler(() => {
		z.number({
			message: 'Invalid resource ID',
		})
			.positive()
			.parse(Number(req.params.id));
	})(req, res, next);

	next();
};

/**
 * Middleware for validating request data using a Zod schema.
 *
 * @param schema - The Zod schema to validate against.
 * @param query - If true, validates `req.query`; otherwise, validates `req.body`.
 *
 * If validation fails, passes an UnprocessableEntity error to next() with details about the validation issues.
 * If validation succeeds, replaces req.body with the validated data and calls next().
 */
export function validateData(schema: ZodTypeAny, query = false) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const results = schema.safeParse(!query ? req.body : req.query);

		if (!results.success) {
			return next(
				new UnprocessableEntity(
					'Invalid request data. Please review your request and try again',
					{
						...results.error,
						issues: results.error.issues.map((issue) => ({
							message: issue.message,
							field: issue.path.join('.'),
						})),
						name: 'ValidationError',
					}
				)
			);
		}

		req.body = results.data;
		next();
	};
}
