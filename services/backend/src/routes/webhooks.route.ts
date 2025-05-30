import express, { Request, Response } from 'express';
import { errorHandler } from '@travelpulse/middlewares';
import { asyncOrders, optIn, optOut } from '../controllers/webhook.controller';
import { ProviderIdentity } from '@travelpulse/interfaces';
// import { secureWebhookMiddleware } from '../middlewares/webhook.middleware';

const router = express.Router();

router.post('/airalo/opt-in', errorHandler(optIn));
router.post('/airalo/opt-out', errorHandler(optOut));

router.head('/airalo/orders', (_req: Request, res: Response) => {
	res.status(200).send('OK');
});

router.post(
	'/airalo/orders',
	// secureWebhookMiddleware,
	errorHandler(asyncOrders(ProviderIdentity.AIRALO))
);

export default router;
