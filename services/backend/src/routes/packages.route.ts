import express from 'express';
import { errorHandler } from '@libs/middlewares';
import { getAllPackages } from '../controllers/packages.controller';

const router = express.Router();

router.get('/', errorHandler(getAllPackages));

export default router;
