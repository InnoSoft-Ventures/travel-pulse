import express from 'express';
import { errorHandler, validateData } from '@libs/middlewares';
import { makeOrder } from '../controllers/orders.controller';
import { OrderPayloadSchema } from '../schema/order.schema';

const router = express.Router();

router.post('/', validateData(OrderPayloadSchema), errorHandler(makeOrder));

export default router;
