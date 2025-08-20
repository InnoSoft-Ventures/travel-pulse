import { Response } from 'express';
import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';
import { DEFAULT_USER_PICTURE } from '@travelpulse/utils';
import User from '../db/models/User';
import { SessionRequest } from '../../types/express';
import { UpdateProfile } from '@travelpulse/interfaces/schemas';
import Country from '../db/models/Country';

export const getProfile = async (req: SessionRequest, res: Response) => {
	const accountId = req.user.accountId;
	const user = await User.findByPk(accountId, {
		attributes: [
			'id',
			'firstName',
			'lastName',
			'email',
			'phone',
			'countryId',
			'createdAt',
		],
		include: [
			{
				model: Country,
				as: 'country',
				attributes: ['id', 'name', 'iso2', 'flag'],
				required: false,
			},
		],
	});

	if (!user) {
		return res
			.status(HTTP_STATUS_CODES.NOT_FOUND)
			.json(successResponse({ user: null }));
	}

	const countryAssoc = (user as any).country as
		| typeof Country.prototype
		| undefined;

	const payload = {
		accountId: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		phoneNumber: user.phone,
		registrationDate: user.createdAt.toISOString(),
		picture: DEFAULT_USER_PICTURE,
		country: countryAssoc
			? {
					id: (countryAssoc as any).id,
					name: (countryAssoc as any).name,
					iso2: (countryAssoc as any).iso2,
					flag: (countryAssoc as any).flag,
				}
			: null,
	};

	return res
		.status(HTTP_STATUS_CODES.OK)
		.json(successResponse({ user: payload }));
};

export const updateProfile = async (req: SessionRequest, res: Response) => {
	const accountId = req.user.accountId;
	const { firstName, lastName, phone, countryId } = req.body as UpdateProfile;

	const user = await User.findByPk(accountId, {
		include: [
			{
				model: Country,
				as: 'country',
				attributes: ['id', 'name', 'iso2', 'flag'],
				required: false,
			},
		],
	});

	if (!user) {
		return res
			.status(HTTP_STATUS_CODES.NOT_FOUND)
			.json(successResponse({ user: null }));
	}

	if (firstName) user.firstName = firstName;
	if (lastName) user.lastName = lastName;
	if (phone) user.phone = phone;
	if (countryId) user.countryId = countryId;

	await user.save();

	const countryAssoc = countryId
		? await Country.findByPk(countryId, {
				attributes: ['id', 'name', 'iso2', 'flag'],
			})
		: null;

	const payload = {
		accountId: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		phoneNumber: user.phone,
		registrationDate: user.createdAt.toISOString(),
		picture: DEFAULT_USER_PICTURE,
		country: countryAssoc
			? {
					id: (countryAssoc as any).id,
					name: (countryAssoc as any).name,
					iso2: (countryAssoc as any).iso2,
					flag: (countryAssoc as any).flag,
				}
			: null,
	};

	return res
		.status(HTTP_STATUS_CODES.CREATED)
		.json(successResponse({ user: payload }));
};
