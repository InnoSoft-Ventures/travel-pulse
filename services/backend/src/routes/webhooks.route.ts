import express, { Request, Response } from 'express';
import { errorHandler } from '@libs/middlewares';
import { asyncOrders, optIn } from '../controllers/webhook.controller';
import { secureWebhookMiddleware } from '../middlewares/webhook.middleware';

const router = express.Router();

router.post('/airalo/opt-in', errorHandler(optIn));

router.head('/airalo/orders', (_req: Request, res: Response) => {
	res.status(200).send('OK');
});

router.post(
	'/airalo/orders',
	secureWebhookMiddleware,
	errorHandler(asyncOrders)
);

export default router;
