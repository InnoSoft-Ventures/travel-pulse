import { SignToken, UserDataDAO } from '@travelpulse/interfaces';
import { comparePassword, hashPassword } from '../utils/hash';
import { BadRequestException, signToken } from '@travelpulse/middlewares';
import User from '../db/models/User';
import { SignInType, SignUpType } from '../schema/auth.schema';

export const registerService = async (
	profileData: SignUpType
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

	// Generate tokens
	const accessToken = signToken<SignToken>(__dirname + '/../', {
		accountId: user.id,
	});

	return {
		user: {
			accountId: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			registrationDate: user.createdAt.toISOString(),
		},
		token: {
			accessToken,
		},
	};
};

export const loginService = async (data: SignInType): Promise<UserDataDAO> => {
	const { email, password } = data;

	const user = await User.findOne({
		where: { email },
	});

	if (!user) {
		throw new BadRequestException('User not found', null);
	}

	const passwordMatch = await comparePassword(password, user.password);

	if (!passwordMatch) {
		throw new BadRequestException('Invalid password', null);
	}

	const accessToken = signToken<SignToken>(__dirname + '/../', {
		accountId: user.id,
	});

	return {
		user: {
			accountId: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			registrationDate: user.createdAt.toISOString(),
		},
		token: {
			accessToken,
		},
	};
};
