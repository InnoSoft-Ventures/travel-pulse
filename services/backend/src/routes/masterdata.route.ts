import express from 'express';
import { processCountries } from '../controllers/masterdata.controller';
import {
	countrySearch,
	getCountries,
	getPopularCountries,
	getRegion,
	getRegions,
	// getCountry,
} from '../controllers/country.controller';
import { errorHandler } from '@travelpulse/middlewares';

const router = express.Router();

router.post('/parse', errorHandler(processCountries));
router.get('/countries/search', errorHandler(countrySearch));
router.get('/countries', errorHandler(getCountries));
router.get('/regions', errorHandler(getRegions));
router.get('/regions/:regionSlug', errorHandler(getRegion));
router.get('/popular-countries', errorHandler(getPopularCountries));

export default router;
