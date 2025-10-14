import crypto from 'crypto';
import { Op } from 'sequelize';
import AccountToken, { AccountTokenType } from '../db/models/AccountToken';
import {
	BadRequestException,
	NotFoundException,
} from '@travelpulse/middlewares';

const ACTIVATION_TTL_HOURS = Math.max(
	parseInt(process.env.ACCOUNT_ACTIVATION_TOKEN_TTL_HOURS || '', 10) || 48,
	1
);

const PASSWORD_RESET_TTL_HOURS = Math.max(
	parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_HOURS || '', 10) || 2,
	1
);

const TOKEN_TTL_MS: Record<AccountTokenType, number> = {
	ACCOUNT_ACTIVATION: ACTIVATION_TTL_HOURS * 60 * 60 * 1000,
	PASSWORD_RESET: PASSWORD_RESET_TTL_HOURS * 60 * 60 * 1000,
};

const hashToken = (token: string): string => {
	return crypto.createHash('sha512').update(token).digest('hex');
};

const markExistingTokensAsConsumed = async (
	userId: number,
	tokenType: AccountTokenType
) => {
	await AccountToken.update(
		{
			consumedAt: new Date(),
			updatedAt: new Date(),
		},
		{
			where: {
				userId,
				tokenType,
				consumedAt: null,
			},
		}
	);
};

const pruneExpiredTokens = async () => {
	await AccountToken.destroy({
		where: {
			expiresAt: {
				[Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // keep a week of history
			},
		},
	});
};

export const createAccountToken = async (
	userId: number,
	tokenType: AccountTokenType
) => {
	await pruneExpiredTokens();
	await markExistingTokensAsConsumed(userId, tokenType);

	const tokenValue = crypto.randomBytes(48).toString('hex');
	const tokenHash = hashToken(tokenValue);
	const expiresAt = new Date(Date.now() + TOKEN_TTL_MS[tokenType]);

	await AccountToken.create({
		userId,
		tokenHash,
		tokenType,
		expiresAt,
	});

	return {
		token: tokenValue,
		expiresAt,
	};
};

export const consumeAccountToken = async (
	rawToken: string,
	tokenType: AccountTokenType
) => {
	if (!rawToken) {
		throw new BadRequestException('Token is required', null);
	}

	const tokenHash = hashToken(rawToken);
	const tokenRecord = await AccountToken.findOne({
		where: {
			tokenHash,
			tokenType,
		},
	});

	if (!tokenRecord) {
		throw new NotFoundException('Token not found', null);
	}

	if (tokenRecord.consumedAt) {
		throw new BadRequestException('Token already used', null);
	}

	if (tokenRecord.expiresAt.getTime() < Date.now()) {
		throw new BadRequestException('Token expired', null);
	}

	tokenRecord.consumedAt = new Date();

	await tokenRecord.save();

	return tokenRecord;
};
