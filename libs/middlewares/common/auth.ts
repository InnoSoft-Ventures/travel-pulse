import { NotFoundException } from "./../exceptions/not-found";
import { UnauthorizedException } from "./../exceptions/validation";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import {
	ERROR_CODE,
	SOMETHING_WENT_WRONG,
	SessionToken,
} from "@libs/interfaces";
import { HTTP_STATUS_CODES } from "../exceptions";
import { errorResponse } from "../httpResponse";

export const getTokenKey = (
	servicePath: string,
	keyType: "public" | "private"
) => {
	try {
		let link = servicePath;

		if (process.env.NODE_ENV === "test") {
			link = __dirname + "/../../../services/auth-service/src";
		}

		const keyPath = path.resolve(link, "secrets", keyType + ".pem");

		return fs.readFileSync(keyPath, "utf8");
	} catch (err) {
		console.error("getTokenKey:", err);

		return "";
	}
};

/**
 * Inter-service authentication middleware.
 * Using `SERVICE_COMMUNICATION_TOKEN` to verify the request is from a trusted service.
 * Extracts user information from the request headers
 */
export const authMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	// Extract bearer token from the request headers
	const token = (req.headers["service-token"] as string | undefined)?.split(
		" "
	)[1];

	const SERVICE_COMMUNICATION_TOKEN =
		process.env.SERVICE_COMMUNICATION_TOKEN || "";

	if (!SERVICE_COMMUNICATION_TOKEN) {
		next(new NotFoundException("Service communication token not found!", null));
	}

	// Verify the token
	if (!token) {
		return next(new UnauthorizedException());
	}

	try {
		tokenVerification(token, SERVICE_COMMUNICATION_TOKEN);

		next();
	} catch (error) {
		console.error("authMiddleware:", error);

		next(new UnauthorizedException());
	}
};

export const tokenSigning = (
	data: string | object | Buffer,
	secret: jwt.Secret,
	options?: jwt.SignOptions
) => {
	return jwt.sign(data, secret, options);
};

export const tokenVerification = (
	token: string,
	secret: jwt.Secret,
	options?: jwt.VerifyOptions
) => {
	return jwt.verify(token, secret, options) as SessionToken;
};

export function signToken<T extends string | object | Buffer>(
	servicePath: string,
	data: T,
	options?: {
		expiresIn: jwt.SignOptions["expiresIn"];
	}
) {
	const secret = getTokenKey(servicePath, "private");

	if (!secret) {
		throw new NotFoundException("Token secret not found!", null);
	}

	return tokenSigning(data, secret, {
		algorithm: "RS256",
		expiresIn: options?.expiresIn || "10d",
	});
}

export function verifyToken<T>(servicePath: string, token: string) {
	const secret = getTokenKey(servicePath, "public");

	if (!secret) {
		console.error("validateToken: Token secret not found!");

		throw new UnauthorizedException({
			error: "Token not found!",
			code: ERROR_CODE.INVALID_TOKEN,
		});
	}

	try {
		return tokenVerification(token, secret, {
			algorithms: ["RS256"],
		}) as T;
	} catch (error) {
		console.error("verifyToken:", error);

		let errorObj = error;

		if (error instanceof (jwt.TokenExpiredError || jwt.JsonWebTokenError)) {
			errorObj = {
				error: "Invalid/Expired token",
				code: ERROR_CODE.INVALID_TOKEN,
			};
		}

		throw new UnauthorizedException({
			error: errorObj,
			code: ERROR_CODE.INVALID_TOKEN,
		});
	}
}

export const extractToken = (
	servicePath: string,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		console.error("extractToken: Authorization header not found!");

		return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(
			errorResponse("Unauthorized access", {
				error: "Authorization header not found",
			})
		);
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		console.error("extractToken: Token not found in the Authorization header!");

		return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(
			errorResponse("Unauthorized access", {
				error: "Token not found",
			})
		);
	}

	const secret = getTokenKey(servicePath, "public");

	if (!secret) {
		console.error("extractToken: Token secret not configured!");

		return res
			.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
			.json(errorResponse(SOMETHING_WENT_WRONG));
	}

	try {
		// @ts-ignore
		req.user = tokenVerification(token, secret, {
			algorithms: ["RS256"],
		});

		return next();
	} catch (error) {
		console.error("extractToken: Token verification failed!", error);

		return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(
			errorResponse("Unauthorized access", {
				error: "Invalid token",
			})
		);
	}
};

/**
 * @param servicePath can be just `__dirname` or `__dirname + '/../../'`
 */
export const routeMiddleware = (servicePath: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.url.includes("/internal")) {
			return authMiddleware(req, res, next);
		}

		return extractToken(servicePath, req, res, next);
	};
};
