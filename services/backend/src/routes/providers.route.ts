import express from 'express';
import {
	airaloAuthenticate,
	getAiraloPackages,
} from '../controllers/providers.controller';
import { errorHandler } from '@travelpulse/middlewares';
import { getAiraloESIMUsage } from '../controllers/sim-usage.controller';
import { providerOnboarding } from '../controllers/provider-onboarding.controller';

const router = express.Router();

// Provider Onboarding
router.post('/onboard', errorHandler(providerOnboarding));

router.post('/airalo/token', errorHandler(airaloAuthenticate));
router.get('/airalo/packages', errorHandler(getAiraloPackages));
router.get('/airalo/sim-usage/:iccid', errorHandler(getAiraloESIMUsage));

export default router;
