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
import {
	sendAccountVerificationEmail,
	sendPasswordResetEmail,
} from '@travelpulse/services';
import {
	LoginFormValues,
	RegisterFormValues,
} from '@travelpulse/interfaces/schemas';
import {
	createAccountToken,
	consumeAccountToken,
	findActiveAccountToken,
} from './account-token.service';
import RefreshToken from '../db/models/RefreshToken';

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

const resolveVerificationBaseUrl = () => {
	const serverPort = getEnv('PORT', '3001');
	const verificationBaseUrl =
		getEnv('AUTH_VERIFICATION_BASE_URL') ||
		getEnv('SERVER_URL') ||
		getEnv('API_BASE_URL') ||
		`http://localhost:${serverPort}`;

	return verificationBaseUrl.replace(/\/$/, '');
};

const buildVerificationUrl = (token: string) =>
	`${resolveVerificationBaseUrl()}/auth/verify-account/${token}`;

const ACTIVATION_RESEND_COOLDOWN_MINUTES = Math.max(
	parseInt(getEnv('ACCOUNT_ACTIVATION_RESEND_COOLDOWN_MINUTES', '1'), 10) ||
		1,
	1
);

const ACTIVATION_RESEND_COOLDOWN_MS =
	ACTIVATION_RESEND_COOLDOWN_MINUTES * 60 * 1000;
const ACTIVATION_RESEND_COOLDOWN_SECONDS = Math.ceil(
	ACTIVATION_RESEND_COOLDOWN_MS / 1000
);

const issueActivationEmail = async (user: User) => {
	const { token } = await createAccountToken(user.id, 'ACCOUNT_ACTIVATION');
	const verifyUrl = buildVerificationUrl(token);

	try {
		await sendAccountVerificationEmail(user.email, {
			firstName: user.firstName,
			lastName: user.lastName,
			verifyUrl,
		});
	} catch (e) {
		// Log and continue; do not block the flow on email failures
		console.error('Failed to send verification email:', e);
	}
};

const ensureActivationResendCooldown = async (userId: number) => {
	const existingToken = await findActiveAccountToken(
		userId,
		'ACCOUNT_ACTIVATION'
	);

	if (!existingToken) {
		return;
	}

	const nextAllowedAt =
		existingToken.createdAt.getTime() + ACTIVATION_RESEND_COOLDOWN_MS;

	if (nextAllowedAt <= Date.now()) {
		return;
	}

	const retryAfterSeconds = Math.ceil((nextAllowedAt - Date.now()) / 1000);
	const minutesRemaining = Math.ceil(retryAfterSeconds / 60);

	throw new BadRequestException(
		minutesRemaining > 1
			? `Please wait ${minutesRemaining} minutes before requesting another verification email.`
			: `Please wait ${retryAfterSeconds} seconds before requesting another verification email.`,
		{ retryAfterSeconds }
	);
};

const resolveFrontendBaseUrl = () => {
	const baseUrl =
		getEnv('FRONTEND_BASE_URL') ||
		getEnv('WEB_APP_URL') ||
		'http://localhost:3000';

	return baseUrl.replace(/\/$/, '');
};

const buildPasswordResetUrl = (token: string) =>
	`${resolveFrontendBaseUrl()}/auth/new-password?token=${token}`;

const PASSWORD_RESET_REQUEST_COOLDOWN_MINUTES = Math.max(
	parseInt(getEnv('PASSWORD_RESET_REQUEST_COOLDOWN_MINUTES', '5'), 10) || 5,
	1
);

const PASSWORD_RESET_REQUEST_COOLDOWN_MS =
	PASSWORD_RESET_REQUEST_COOLDOWN_MINUTES * 60 * 1000;
const PASSWORD_RESET_REQUEST_COOLDOWN_SECONDS = Math.ceil(
	PASSWORD_RESET_REQUEST_COOLDOWN_MS / 1000
);

const ensurePasswordResetCooldown = async (userId: number) => {
	const existingToken = await findActiveAccountToken(
		userId,
		'PASSWORD_RESET'
	);

	if (!existingToken) {
		return;
	}

	const nextAllowedAt =
		existingToken.createdAt.getTime() + PASSWORD_RESET_REQUEST_COOLDOWN_MS;

	if (nextAllowedAt <= Date.now()) {
		return;
	}

	const retryAfterSeconds = Math.ceil((nextAllowedAt - Date.now()) / 1000);
	const minutesRemaining = Math.ceil(retryAfterSeconds / 60);

	throw new BadRequestException(
		minutesRemaining > 1
			? `Please wait ${minutesRemaining} minutes before requesting another password reset email.`
			: `Please wait ${retryAfterSeconds} seconds before requesting another password reset email.`,
		{ retryAfterSeconds }
	);
};

const issuePasswordResetEmail = async (user: User) => {
	const { token } = await createAccountToken(user.id, 'PASSWORD_RESET');
	const resetUrl = buildPasswordResetUrl(token);

	try {
		await sendPasswordResetEmail(user.email, {
			firstName: user.firstName,
			lastName: user.lastName,
			resetUrl,
		});
	} catch (e) {
		console.error('Failed to send password reset email:', e);
	}
};

const revokeUserRefreshTokens = async (userId: number) => {
	await RefreshToken.update(
		{
			revokedAt: new Date(),
			revokedByIp: 'PASSWORD_RESET',
			updatedAt: new Date(),
		},
		{
			where: {
				userId,
				revokedAt: null,
			},
		}
	);
};

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

	await issueActivationEmail(user);

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

export const resendActivationEmailService = async (email: string) => {
	const normalizedEmail = email.trim().toLowerCase();
	const user = await User.findOne({
		where: { email: normalizedEmail },
	});

	if (!user) {
		// Avoid account enumeration by returning success even if user is missing
		return {
			sent: false,
			cooldownSeconds: ACTIVATION_RESEND_COOLDOWN_SECONDS,
		} as const;
	}

	if (user.isActivated) {
		return {
			sent: false,
			alreadyActivated: true,
			cooldownSeconds: ACTIVATION_RESEND_COOLDOWN_SECONDS,
		} as const;
	}

	await ensureActivationResendCooldown(user.id);
	await issueActivationEmail(user);

	return {
		sent: true,
		cooldownSeconds: ACTIVATION_RESEND_COOLDOWN_SECONDS,
	} as const;
};

export const requestPasswordResetService = async (email: string) => {
	const normalizedEmail = email.trim().toLowerCase();
	const user = await User.findOne({
		where: { email: normalizedEmail },
	});

	if (!user) {
		return {
			sent: false,
			cooldownSeconds: PASSWORD_RESET_REQUEST_COOLDOWN_SECONDS,
		} as const;
	}

	await ensurePasswordResetCooldown(user.id);
	await issuePasswordResetEmail(user);

	return {
		sent: true,
		cooldownSeconds: PASSWORD_RESET_REQUEST_COOLDOWN_SECONDS,
	} as const;
};

export const resetPasswordService = async (token: string, password: string) => {
	const tokenRecord = await consumeAccountToken(token, 'PASSWORD_RESET');
	const user = await User.findByPk(tokenRecord.userId);

	if (!user) {
		throw new NotFoundException('User not found', null);
	}

	const hashedPassword = await hashPassword(password);
	user.password = hashedPassword;

	await user.save();
	await revokeUserRefreshTokens(user.id);

	return true;
};
