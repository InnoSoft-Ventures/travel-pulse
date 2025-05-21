import express from 'express';
import { errorHandler } from '@travelpulse/middlewares';
import {
	getGlobalPackages,
	getMultipleRegions,
	getPopularDestinations,
	getRegionPackages,
} from '../controllers/products.controller';

const router = express.Router();

router.get('/regions', errorHandler(getMultipleRegions));
router.get('/regions/:regionSlug', errorHandler(getRegionPackages));
router.get('/global', errorHandler(getGlobalPackages));
router.get('/popular-destinations', errorHandler(getPopularDestinations));

export default router;
