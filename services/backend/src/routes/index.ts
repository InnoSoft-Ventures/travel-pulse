import { Router } from 'express';

import healthRoute from './health.route';
import masterDataRoute from './masterdata.route';
import providersRoute from './providers.route';
import webhooksRoute from './webhooks.route';
import ordersRoute from './orders.route';

const router = Router();

router.use('/', healthRoute);
router.use('/data', masterDataRoute);
router.use('/providers', providersRoute);
router.use('/webhooks', webhooksRoute);

router.use('/orders', ordersRoute);

export default router;
