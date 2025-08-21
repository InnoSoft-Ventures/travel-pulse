import { successResponse } from '@travelpulse/middlewares';
import { Response } from 'express';
import { SessionRequest } from '../../types/express';
import {
	getEsimDetailsService,
	getEsimQrService,
	listEsimsService,
} from '../services/esims/esims.service';

export const listEsims = async (req: SessionRequest, res: Response) => {
	const data = await listEsimsService(req, req.query as any);
	res.json(successResponse(data, 'eSIMs retrieved successfully'));
};

export const getEsimDetails = async (req: SessionRequest, res: Response) => {
	const simId = Number(req.params.simId);
	const data = await getEsimDetailsService(req, simId);
	res.json(successResponse(data, 'eSIM details retrieved successfully'));
};

export const getEsimQr = async (req: SessionRequest, res: Response) => {
	const simId = Number(req.params.simId);
	const data = await getEsimQrService(req, simId);
	res.json(successResponse(data, 'eSIM QR retrieved successfully'));
};
