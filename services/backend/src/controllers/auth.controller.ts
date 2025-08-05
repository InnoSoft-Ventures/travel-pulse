// import { generateAccessToken } from './tokenService';

import { Request, Response } from 'express';
import { loginService, registerService } from '../services/auth.service';
import { HTTP_STATUS_CODES, successResponse } from '@travelpulse/middlewares';

export const registerUser = async (req: Request, res: Response) => {
	const results = await registerService(req.body);

	res.status(HTTP_STATUS_CODES.CREATED).json(successResponse(results));
};

export const loginUser = async (req: Request, res: Response) => {
	const data = await loginService(req.body);

	const { token, user } = data;

	res.cookie('token', token.accessToken, {
		httpOnly: true,
		secure: false, // ✅ for local dev only
		sameSite: 'lax',
		maxAge: 3600000, // 1 hour
	});

	res.json(successResponse({ user }));
};

// export const refreshToken = (req: any, res: any) => {
// 	const refreshToken = req.body.refreshToken;

// 	if (!refreshToken)
// 		return res.status(401).json({ message: 'Token required' });

// 	jwt.verify(
// 		refreshToken,
// 		process.env.REFRESH_TOKEN_SECRET,
// 		(err: any, user: any) => {
// 			if (err) return res.status(403).json({ message: 'Invalid token' });

// 			const newAccessToken = generateAccessToken({ id: user.id });
// 			res.json({ accessToken: newAccessToken });
// 		}
// 	);
// };
