import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import {
	loginUser,
	registerUser,
	logoutUser,
	refreshSession,
	verifyAccount,
} from '../controllers/auth.controller';
import { LoginSchema, RegisterSchema } from '@travelpulse/interfaces/schemas';

const router = express.Router();

router.post(
	'/signup',
	validateData(RegisterSchema),
	errorHandler(registerUser)
);
router.post('/signin', validateData(LoginSchema), errorHandler(loginUser));
router.post('/logout', errorHandler(logoutUser));
router.post('/refresh', errorHandler(refreshSession));
router.get('/verify-account/:token', errorHandler(verifyAccount));

export default router;
