import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import {
	getGlobalPackages,
	getPopularDestinations,
	getMultipleRegions,
	getRegionPackages,
	getLocalPackages,
	searchProducts,
} from '../controllers/products.controller';
import { ProductSearchSchema } from '../schema/product.schema';

const router = express.Router();

router.get('/regions', errorHandler(getMultipleRegions));
router.get('/regions/:regionSlug', errorHandler(getRegionPackages));
router.get('/global', errorHandler(getGlobalPackages));
router.get('/popular-destinations', errorHandler(getPopularDestinations));
router.get('/local/:countrySlug', errorHandler(getLocalPackages));

router.get(
	'/search',
	validateData(ProductSearchSchema, true),
	errorHandler(searchProducts)
);

export default router;
