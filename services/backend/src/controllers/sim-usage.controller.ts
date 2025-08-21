import { Response } from 'express';
import { SessionRequest } from '../../types/express';
import { successResponse } from '@travelpulse/middlewares';
import { getAiraloESIMUsageService } from '../services/sim-usage/airalo-sim-usage';

export const getAiraloESIMUsage = async (
	req: SessionRequest,
	res: Response
) => {
	const iccid = req.params.iccid;
	const data = await getAiraloESIMUsageService(iccid);

	res.json(successResponse(data, 'eSIM usage retrieved successfully'));
};
