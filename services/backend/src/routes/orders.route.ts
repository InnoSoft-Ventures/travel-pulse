import express from 'express';
import { errorHandler } from '@libs/middlewares';
import { makeOrder } from '../controllers/orders.controller';

const router = express.Router();

router.post('/', errorHandler(makeOrder));

export default router;
