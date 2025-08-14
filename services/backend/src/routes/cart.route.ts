import express from 'express';
import { errorHandler, validateData } from '@travelpulse/middlewares';
import { processCart } from '../controllers/cart.controller';
import { CartSchema } from '@travelpulse/interfaces/schemas';

const router = express.Router();

router.post('/', validateData(CartSchema), errorHandler(processCart));

export default router;
