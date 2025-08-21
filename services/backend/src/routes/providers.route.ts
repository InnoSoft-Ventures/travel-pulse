import express from 'express';
import {
	airaloAuthenticate,
	getAiraloPackages,
} from '../controllers/providers.controller';
import { errorHandler } from '@travelpulse/middlewares';
import { getAiraloESIMUsage } from '../controllers/sim-usage.controller';

const router = express.Router();

router.post('/airalo/token', errorHandler(airaloAuthenticate));
router.get('/airalo/packages', errorHandler(getAiraloPackages));
router.get('/airalo/sim-usage/:iccid', errorHandler(getAiraloESIMUsage));

export default router;
