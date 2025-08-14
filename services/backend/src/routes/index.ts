import { Router } from 'express';

import healthRoute from './health.route';
import masterDataRoute from './masterdata.route';
import providersRoute from './providers.route';
import webhooksRoute from './webhooks.route';
import ordersRoute from './orders.route';
import productsRoute from './products.route';
import authRoute from './auth.route';
import cartRoute from './cart.route';

const router = Router();

router.use('/', healthRoute);
router.use('/data', masterDataRoute);
router.use('/providers', providersRoute);
router.use('/webhooks', webhooksRoute);

router.use('/products', productsRoute);

router.use('/orders', ordersRoute);

// Auth routes
router.use('/auth', authRoute);
router.use('/cart', cartRoute);

export default router;
