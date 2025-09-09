import { Request, Response } from 'express';
import Provider from '../db/models/Provider';
import { BadRequestException, successResponse } from '@travelpulse/middlewares';

export const providerOnboarding = async (req: Request, res: Response) => {
	const { providerIdentity, clientId, clientSecret, grantType } = req.body;

	// Check provider exists
	const provider = await Provider.findOne({
		where: {
			identityName: providerIdentity,
		},
	});

	if (!provider) {
		throw new BadRequestException('Provider does not exist', null);
	}

	// Create new provider
	provider.clientId = clientId;
	provider.clientSecret = clientSecret;
	provider.grantType = grantType;

	await provider.save();

	res.status(201).json(successResponse('Provider onboarded successfully'));
};
