import express from 'express';
import { errorHandler } from '@libs/middlewares';
import {
	getGlobalPackages,
	getMultipleRegions,
	getRegionPackages,
} from '../controllers/products.controller';

const router = express.Router();

router.get('/regions', errorHandler(getMultipleRegions));
router.get('/regions/:regionSlug', errorHandler(getRegionPackages));
router.get('/global', errorHandler(getGlobalPackages));

export default router;
