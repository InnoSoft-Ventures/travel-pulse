import express from 'express';
import { errorHandler } from '@travelpulse/middlewares';
import { getEsimDetails, getEsimQr, listEsims } from '../controllers/esims.controller';

const router = express.Router();

// GET /esims?status=active|inactive|all&page=1&size=20
router.get('/', errorHandler(listEsims));

// GET /esims/:simId
router.get('/:simId', errorHandler(getEsimDetails));

// GET /esims/:simId/qr
router.get('/:simId/qr', errorHandler(getEsimQr));

export default router;
