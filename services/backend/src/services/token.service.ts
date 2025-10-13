import crypto from 'crypto';
import { Op } from 'sequelize';
import { SignToken } from '@travelpulse/interfaces';
import { UnauthorizedException, signToken } from '@travelpulse/middlewares';
import RefreshToken from '../db/models/RefreshToken';
import User from '../db/models/User';

export interface TokenMetadata {
	ipAddress?: string | null;
	userAgent?: string | null;
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
	refreshTokenExpiresAt: Date;
}

export interface RotatedTokenPayload extends TokenPair {
	accountId: number;
	email: string;
}

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';

const REFRESH_TOKEN_TTL_DAYS = Math.max(
	parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '', 10) || 30,
	1
);

const MAX_ACTIVE_REFRESH_TOKENS = Math.max(
	parseInt(process.env.MAX_ACTIVE_REFRESH_TOKENS || '', 10) || 5,
	1
);

const MULTIPLIERS: Record<string, number> = {
	s: 1000,
	m: 60 * 1000,
	h: 60 * 60 * 1000,
	d: 24 * 60 * 60 * 1000,
};

const parseDurationToMs = (value: string): number => {
	const match = /^(\d+)([smhd])$/i.exec(value.trim());

	if (!match) {
		return 15 * 60 * 1000; // 15 minutes fallback
	}

	const amount = Number(match[1]);
	const unit = match[2].toLowerCase();

	return amount * (MULTIPLIERS[unit] || MULTIPLIERS['m']);
};

const ACCESS_TOKEN_TTL_MS = parseDurationToMs(ACCESS_TOKEN_TTL);
const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

const hashToken = (token: string): string => {
	return crypto.createHash('sha512').update(token).digest('hex');
};

const buildAccessToken = (payload: SignToken) => {
	return signToken(__dirname + '/../', payload, {
		expiresIn: ACCESS_TOKEN_TTL,
	});
};

const createRefreshTokenRecord = async (
	userId: number,
	metadata: TokenMetadata
) => {
	const refreshTokenValue = crypto.randomBytes(64).toString('hex');
	const tokenHash = hashToken(refreshTokenValue);
	const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

	await RefreshToken.create({
		userId,
		tokenHash,
		expiresAt,
		createdByIp: metadata.ipAddress ?? null,
		userAgent: metadata.userAgent ?? null,
	});

	return { refreshTokenValue, expiresAt, tokenHash };
};

const validateRefreshTokenRecord = (token?: RefreshToken) => {
	if (!token) {
		throw new UnauthorizedException(
			{ error: 'Invalid refresh token' },
			'Unauthorized access'
		);
	}

	if (token.revokedAt) {
		throw new UnauthorizedException(
			{ error: 'Refresh token revoked' },
			'Unauthorized access'
		);
	}

	if (token.expiresAt.getTime() < Date.now()) {
		throw new UnauthorizedException(
			{ error: 'Refresh token expired' },
			'Unauthorized access'
		);
	}
};

const pruneExpiredTokens = async (userId: number) => {
	await RefreshToken.destroy({
		where: {
			userId,
			expiresAt: { [Op.lt]: new Date() },
		},
	});
};

const enforceActiveTokenLimit = async (userId: number) => {
	const totalActive = await RefreshToken.count({
		where: {
			userId,
			revokedAt: null,
		},
	});

	if (totalActive < MAX_ACTIVE_REFRESH_TOKENS) {
		return;
	}

	const oldestActiveTokens = await RefreshToken.findAll({
		where: {
			userId,
			revokedAt: null,
		},
		order: [['createdAt', 'ASC']],
		limit: totalActive - (MAX_ACTIVE_REFRESH_TOKENS - 1),
	});

	for (const token of oldestActiveTokens) {
		token.revokedAt = new Date();
		token.revokedByIp = 'SYSTEM_LIMIT';
		token.updatedAt = new Date();
		await token.save();
	}
};

export const issueSessionTokens = async (
	userId: number,
	email: string,
	metadata: TokenMetadata
): Promise<TokenPair> => {
	await pruneExpiredTokens(userId);
	await enforceActiveTokenLimit(userId);

	const accessToken = buildAccessToken({
		accountId: userId,
		email,
	});

	const { refreshTokenValue, expiresAt } =
		await createRefreshTokenRecord(userId, metadata);

	return {
		accessToken,
		refreshToken: refreshTokenValue,
		refreshTokenExpiresAt: expiresAt,
	};
};

const getRefreshTokenRecord = async (tokenValue: string) => {
	const tokenHash = hashToken(tokenValue);
	const token = await RefreshToken.findOne({
		where: {
			tokenHash,
		},
	});

	validateRefreshTokenRecord(token || undefined);

	return token!;
};

export const rotateRefreshToken = async (
	refreshTokenValue: string,
	metadata: TokenMetadata
): Promise<RotatedTokenPayload> => {
	const tokenRecord = await getRefreshTokenRecord(refreshTokenValue);

	const user = await User.findByPk(tokenRecord.userId, {
		attributes: ['id', 'email'],
	});

	if (!user) {
		throw new UnauthorizedException(
			{ error: 'Account no longer exists' },
			'Unauthorized access'
		);
	}

	const accessToken = buildAccessToken({
		accountId: user.id,
		email: user.email || '',
	});

	const { refreshTokenValue: newRefreshTokenValue, tokenHash, expiresAt } =
		await createRefreshTokenRecord(user.id, metadata);

	tokenRecord.revokedAt = new Date();
	tokenRecord.revokedByIp = metadata.ipAddress ?? null;
	tokenRecord.replacedByToken = tokenHash;
	tokenRecord.updatedAt = new Date();

	await tokenRecord.save();

	return {
		accessToken,
		refreshToken: newRefreshTokenValue,
		refreshTokenExpiresAt: expiresAt,
		accountId: user.id,
		email: user.email || '',
	};
};

export const revokeRefreshToken = async (
	refreshTokenValue: string,
	metadata: TokenMetadata
) => {
	const tokenHash = hashToken(refreshTokenValue);

	const token = await RefreshToken.findOne({
		where: {
			tokenHash,
			revokedAt: null,
		},
	});

	if (!token) {
		return;
	}

	token.revokedAt = new Date();
	token.revokedByIp = metadata.ipAddress ?? null;
	token.updatedAt = new Date();

	await token.save();
};

export const getAccessTokenTtlMs = () => ACCESS_TOKEN_TTL_MS;
export const getRefreshTokenTtlMs = () => REFRESH_TOKEN_TTL_MS;
