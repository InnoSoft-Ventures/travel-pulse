import { Router } from 'express';

import pingRoute from './ping.route';
import masterDataRoute from './masterdata.route';

const router = Router();

router.use('/ping', pingRoute);
router.use('/data', masterDataRoute);

export default router;
