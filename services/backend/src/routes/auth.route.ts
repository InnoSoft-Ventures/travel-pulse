import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import {
	loginUser,
	registerUser,
	logoutUser,
	refreshSession,
	verifyAccount,
	resendVerificationEmail,
	requestPasswordReset,
	resetPassword,
} from '../controllers/auth.controller';
import { LoginSchema, RegisterSchema } from '@travelpulse/interfaces/schemas';
import { EmailSchema, ResetPasswordSchema } from '../schema/auth.schema';

const router = express.Router();

router.post(
	'/signup',
	validateData(RegisterSchema),
	errorHandler(registerUser)
);
router.post('/signin', validateData(LoginSchema), errorHandler(loginUser));
router.post('/logout', errorHandler(logoutUser));
router.post('/refresh', errorHandler(refreshSession));
router.post(
	'/resend-verification',
	validateData(EmailSchema),
	errorHandler(resendVerificationEmail)
);
router.post(
	'/forgot-password',
	validateData(EmailSchema),
	errorHandler(requestPasswordReset)
);
router.post(
	'/reset-password',
	validateData(ResetPasswordSchema),
	errorHandler(resetPassword)
);
router.get('/verify-account/:token', errorHandler(verifyAccount));

export default router;
