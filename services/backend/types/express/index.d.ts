import { Request } from 'express';
import { SessionToken } from '@travelpulse/interfaces';

declare module 'express' {
	export interface Request {
		user?: SessionToken; // Adjust the type according to your payload
		// cookies?: Record<string, string>;
	}
}

export interface SessionRequest extends Request {
	user: SessionToken; // Ensure user is always present
}
