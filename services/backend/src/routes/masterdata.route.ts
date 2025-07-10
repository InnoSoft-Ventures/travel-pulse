import express from 'express';
import { processCountries } from '../controllers/masterdata.controller';
import {
	countrySearch,
	getCountries,
	getPopularCountries,
	getRegions,
	// getCountry,
} from '../controllers/country.controller';
import { errorHandler } from '@travelpulse/middlewares';

const router = express.Router();

router.post('/parse', errorHandler(processCountries));
router.get('/countries/search', errorHandler(countrySearch));
router.get('/countries', errorHandler(getCountries));
router.get('/regions', errorHandler(getRegions));
// router.get('/countries/:country', errorHandler(getCountry));
router.get('/popular-countries', errorHandler(getPopularCountries));

export default router;
