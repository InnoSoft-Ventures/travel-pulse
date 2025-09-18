import { Router } from 'express';

import healthRoute from './health.route';
import masterDataRoute from './masterdata.route';
import providersRoute from './providers.route';
import webhooksRoute from './webhooks.route';
import ordersRoute from './orders.route';
import productsRoute from './products.route';
import esimsRoute from './esims.route';
import authRoute from './auth.route';
import cartRoute from './cart.route';
import accountRoute from './account.route';
import { routeMiddleware } from '@travelpulse/middlewares';
import User from '../db/models/User';

const router = Router();

router.use('/', healthRoute);
router.use('/data', masterDataRoute);
router.use('/providers', providersRoute);

router.use('/webhooks', webhooksRoute);

router.use('/products', productsRoute);

// Auth routes
router.use('/auth', authRoute);

// Cart management routes
router.use('/cart', cartRoute);

// Protected routes
router.use(routeMiddleware(__dirname + '/../', User));

// Order management routes
router.use('/orders', ordersRoute);

// Account management routes
router.use('/account', accountRoute);

// eSIM management routes
router.use('/esims', esimsRoute);

export default router;
