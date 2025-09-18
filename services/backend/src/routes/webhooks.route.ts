import express, { Request, Response } from 'express';
import { errorHandler } from '@travelpulse/middlewares';
import {
	asyncOrders,
	notificationDetails,
	optIn,
	optOut,
	paystackWebhook,
	webhookAiraloLowData,
	webhookAiraloSimulator,
} from '../controllers/webhook.controller';
import { ProviderIdentity } from '@travelpulse/interfaces';
// import { secureWebhookMiddleware } from '../middlewares/webhook.middleware';

const router = express.Router();

router.post('/airalo/opt-in', errorHandler(optIn));
router.post('/airalo/opt-out', errorHandler(optOut));
router.get('/airalo/notification-details', errorHandler(notificationDetails));
router.post('/airalo/simulator', errorHandler(webhookAiraloSimulator));

['/airalo/low-data', '/airalo/orders'].forEach((route) => {
	router.head(route, (_req: Request, res: Response) => {
		res.status(200).send('OK');
	});
});

router.post(
	'/airalo/orders',
	// secureWebhookMiddleware,
	errorHandler(asyncOrders(ProviderIdentity.AIRALO))
);

router.post('/airalo/low-data', errorHandler(webhookAiraloLowData));

// Paystack
router.post('/paystack', errorHandler(paystackWebhook));

export default router;
