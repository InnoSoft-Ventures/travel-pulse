import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import { SignInSchema, SignUpSchema } from '../schema/auth.schema';
import { loginUser, registerUser, logoutUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', validateData(SignUpSchema), errorHandler(registerUser));
router.post('/signin', validateData(SignInSchema), errorHandler(loginUser));
router.post('/logout', errorHandler(logoutUser));

export default router;
