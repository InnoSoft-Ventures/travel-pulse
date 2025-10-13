import { UserDataDAO } from '@travelpulse/interfaces';
import { comparePassword, hashPassword } from '../utils/hash';
import { BadRequestException, NotFoundException } from '@travelpulse/middlewares';
import User from '../db/models/User';
import { SignInType, SignUpType } from '../schema/auth.schema';
import { DEFAULT_USER_PICTURE } from '@travelpulse/utils';
import Country from '../db/models/Country';
import { TokenMetadata, issueSessionTokens } from './token.service';

const buildUserResponse = (
	user: User & { country?: Country | null }
): UserDataDAO['user'] => ({
	accountId: user.id,
	email: user.email,
	firstName: user.firstName,
	lastName: user.lastName,
	phoneNumber: user.phone || '',
	registrationDate: user.createdAt.toISOString(),
	picture: DEFAULT_USER_PICTURE,
	country: user.country
		? {
				id: user.country.id,
				name: user.country.name,
				iso2: user.country.iso2,
				flag: user.country.flag,
		  }
		: null,
});

export const registerService = async (
	profileData: SignUpType,
	metadata: TokenMetadata = {}
): Promise<UserDataDAO> => {
	const { email, firstName, lastName, password } = profileData;

	// Check if user already exists
	const existingUser = await User.findOne({
		where: { email: profileData.email },
	});

	if (existingUser) {
		throw new BadRequestException('User already exists', null);
	}

	// Hash password
	const hashedPassword = await hashPassword(password);

	// Create user
	const user = await User.create({
		email,
		password: hashedPassword,
		firstName,
		lastName,
	});

	// Generate session tokens
	const tokens = await issueSessionTokens(user.id, user.email, metadata);

	return {
		user: buildUserResponse(user),
		token: {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			refreshTokenExpiresAt:
				tokens.refreshTokenExpiresAt.toISOString(),
		},
	};
};

export const loginService = async (
	data: SignInType,
	metadata: TokenMetadata = {}
): Promise<UserDataDAO> => {
	const { email, password } = data;

	const user = await User.findOne({
		where: { email },
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
		throw new BadRequestException('User not found', null);
	}

	const passwordMatch = await comparePassword(password, user.password);

	if (!passwordMatch) {
		throw new BadRequestException('Invalid password', null);
	}

	const tokens = await issueSessionTokens(user.id, user.email, metadata);

	return {
		user: buildUserResponse(user),
		token: {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			refreshTokenExpiresAt:
				tokens.refreshTokenExpiresAt.toISOString(),
		},
	};
};

export const getUserSessionById = async (
	accountId: number
): Promise<UserDataDAO['user']> => {
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
		throw new NotFoundException('User not found', null);
	}

	return buildUserResponse(user);
};
