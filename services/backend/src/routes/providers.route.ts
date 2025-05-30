import express from 'express';
import {
	airaloAuthenticate,
	getAiraloPackages,
} from '../controllers/providers.controller';
import { errorHandler } from '@travelpulse/middlewares';

const router = express.Router();

router.post('/airalo/token', errorHandler(airaloAuthenticate));
router.get('/airalo', errorHandler(getAiraloPackages));

export default router;
