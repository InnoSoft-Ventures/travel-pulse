import express from 'express';
import { errorHandler } from '@travelpulse/middlewares';
import {
	getEsimDetails,
	getEsimQr,
	listEsims,
	getPackageHistory,
} from '../controllers/esims.controller';

const router = express.Router();

// GET /esims?status=active|inactive|all&page=1&size=20
router.get('/', errorHandler(listEsims));

// GET /esims/:simId
router.get('/:simId', errorHandler(getEsimDetails));

// GET /esims/:simId/qr
router.get('/:simId/qr', errorHandler(getEsimQr));

// GET /esims/:simId/package-history
router.get('/:simId/package-history', errorHandler(getPackageHistory));

export default router;
