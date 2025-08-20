import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import { getProfile, updateProfile } from '../controllers/account.controller';
import { UpdateProfileSchema } from '@travelpulse/interfaces/schemas';

const router = express.Router();

router.get('/me', errorHandler(getProfile));
router.patch(
	'/me',
	validateData(UpdateProfileSchema),
	errorHandler(updateProfile)
);

export default router;
