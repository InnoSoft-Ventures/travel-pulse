import { Request, Response } from 'express';
import {
	getUserSessionById,
	loginService,
	registerService,
} from '../services/auth.service';
import {
	HTTP_STATUS_CODES,
	errorResponse,
	successResponse,
} from '@travelpulse/middlewares';
import {
	TokenMetadata,
	getAccessTokenTtlMs,
	getRefreshTokenTtlMs,
	rotateRefreshToken,
	revokeRefreshToken,
} from '../services/token.service';

const isProduction = process.env.NODE_ENV === 'production';

type SameSiteOption = 'lax' | 'strict' | 'none';

const parseSameSite = (): SameSiteOption => {
	const value = (process.env.AUTH_COOKIE_SAME_SITE || 'lax').toLowerCase();

	if (value === 'none' || value === 'strict') {
		return value;
	}

	return 'lax';
};

const SAME_SITE = parseSameSite();
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN || undefined;
const AUTH_COOKIE_SECURE = process.env.AUTH_COOKIE_SECURE === 'true';
const SECURE_COOKIE =
	SAME_SITE === 'none' ? true : isProduction || AUTH_COOKIE_SECURE;
const ACCESS_TOKEN_MAX_AGE = getAccessTokenTtlMs();
const REFRESH_TOKEN_MAX_AGE = getRefreshTokenTtlMs();

const buildTokenMetadata = (req: Request): TokenMetadata => ({
	ipAddress:
		(req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
		req.ip ||
		null,
	userAgent: req.headers['user-agent'] || null,
});

const applyAuthCookies = (
	res: Response,
	tokens: { accessToken: string; refreshToken: string }
) => {
	const baseOptions = {
		httpOnly: true,
		secure: SECURE_COOKIE,
		sameSite: SAME_SITE,
		domain: COOKIE_DOMAIN,
		path: '/',
	} as const;

	res.cookie('token', tokens.accessToken, {
		...baseOptions,
		maxAge: ACCESS_TOKEN_MAX_AGE,
	});

	res.cookie('refreshToken', tokens.refreshToken, {
		...baseOptions,
		maxAge: REFRESH_TOKEN_MAX_AGE,
	});
};

const clearAuthCookies = (res: Response) => {
	const baseOptions = {
		httpOnly: true,
		secure: SECURE_COOKIE,
		sameSite: SAME_SITE,
		domain: COOKIE_DOMAIN,
		path: '/',
	} as const;

	res.clearCookie('token', baseOptions);
	res.clearCookie('refreshToken', baseOptions);
};

export const registerUser = async (req: Request, res: Response) => {
	const metadata = buildTokenMetadata(req);
	const results = await registerService(req.body, metadata);

	const {
		token: { accessToken, refreshToken, refreshTokenExpiresAt },
		user,
	} = results;

	if (!refreshToken) {
		throw new Error('Refresh token generation failed');
	}

	applyAuthCookies(res, {
		accessToken,
		refreshToken,
	});

	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse({
			user,
			token: {
				accessToken,
				refreshTokenExpiresAt,
			},
		})
	);
};

export const loginUser = async (req: Request, res: Response) => {
	const metadata = buildTokenMetadata(req);
	const results = await loginService(req.body, metadata);

	const {
		token: { accessToken, refreshToken, refreshTokenExpiresAt },
		user,
	} = results;

	if (!refreshToken) {
		throw new Error('Refresh token generation failed');
	}

	applyAuthCookies(res, {
		accessToken,
		refreshToken,
	});

	res.json(
		successResponse({
			user,
			token: {
				accessToken,
				refreshTokenExpiresAt,
			},
		})
	);
};

export const logoutUser = async (req: Request, res: Response) => {
	const metadata = buildTokenMetadata(req);
	const potentialToken =
		req.cookies?.refreshToken || req.body?.refreshToken;
	const refreshTokenValue =
		typeof potentialToken === 'string' ? potentialToken : undefined;

	if (refreshTokenValue) {
		await revokeRefreshToken(refreshTokenValue, metadata);
	}

	clearAuthCookies(res);

	return res.status(HTTP_STATUS_CODES.OK).json(successResponse({}));
};

export const refreshSession = async (req: Request, res: Response) => {
	const potentialToken =
		req.cookies?.refreshToken || req.body?.refreshToken;
	const refreshTokenValue =
		typeof potentialToken === 'string' ? potentialToken : undefined;

	if (!refreshTokenValue) {
		return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(
			errorResponse('Unauthorized access', {
				error: 'Refresh token required',
			})
		);
	}

	const metadata = buildTokenMetadata(req);
	const rotated = await rotateRefreshToken(refreshTokenValue, metadata);
	const user = await getUserSessionById(rotated.accountId);

	applyAuthCookies(res, {
		accessToken: rotated.accessToken,
		refreshToken: rotated.refreshToken,
	});

	return res.status(HTTP_STATUS_CODES.OK).json(
		successResponse({
			user,
			token: {
				accessToken: rotated.accessToken,
				refreshTokenExpiresAt:
					rotated.refreshTokenExpiresAt.toISOString(),
			},
		})
	);
};
