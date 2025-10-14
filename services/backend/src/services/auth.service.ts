import { UserDataDAO } from '@travelpulse/interfaces';
import { comparePassword, hashPassword } from '../utils/hash';
import {
	BadRequestException,
	NotFoundException,
} from '@travelpulse/middlewares';
import User from '../db/models/User';
import { DEFAULT_USER_PICTURE, getEnv } from '@travelpulse/utils';
import Country from '../db/models/Country';
import { TokenMetadata, issueSessionTokens } from './token.service';
import { sendAccountVerificationEmail } from '@travelpulse/services';
import {
	LoginFormValues,
	RegisterFormValues,
} from '@travelpulse/interfaces/schemas';
import {
	createAccountToken,
	consumeAccountToken,
} from './account-token.service';

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
	isActivated: Boolean(user.isActivated),
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
	profileData: RegisterFormValues
): Promise<Omit<UserDataDAO, 'token'>> => {
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

	const { token: activationToken } = await createAccountToken(
		user.id,
		'ACCOUNT_ACTIVATION'
	);

	// Fire-and-forget: send account verification email (best-effort)
	try {
		const serverBaseUrl = getEnv('SERVER_URL');

		const verifyUrl = `${serverBaseUrl}/auth/verify-account/${activationToken}`;

		await sendAccountVerificationEmail(user.email, {
			firstName: user.firstName,
			lastName: user.lastName,
			verifyUrl,
		});
	} catch (e) {
		// Log and continue; do not block signup on email failures
		console.error('Failed to send verification email:', e);
	}

	return {
		user: buildUserResponse(user),
	};
};

export const loginService = async (
	data: LoginFormValues,
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

	if (!user.isActivated) {
		throw new BadRequestException(
			'Account is not activated. Please verify your email.',
			{ errorCode: 'ACCOUNT_NOT_ACTIVATED' }
		);
	}

	const tokens = await issueSessionTokens(user.id, user.email, metadata);

	return {
		user: buildUserResponse(user),
		token: {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
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

export const verifyAccountService = async (token: string) => {
	const tokenRecord = await consumeAccountToken(token, 'ACCOUNT_ACTIVATION');

	const user = await User.findByPk(tokenRecord.userId);

	if (!user) {
		throw new NotFoundException('User not found', null);
	}

	if (!user.isActivated) {
		user.isActivated = true;

		await user.save();
	}

	return true;
};
