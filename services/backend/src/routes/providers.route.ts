import express from 'express';
import { authenticate, getPackages } from '../controllers/providers.controller';
import { errorHandler } from '@travelpulse/middlewares';

const router = express.Router();

router.post('/airalo/token', errorHandler(authenticate));
router.get('/airalo', errorHandler(getPackages));

export default router;
