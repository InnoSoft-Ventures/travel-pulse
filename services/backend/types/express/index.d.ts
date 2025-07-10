import { Request } from 'express';
import { SessionToken } from '@travelpulse/interfaces';

declare module 'express' {
	export interface Request {
		user?: SessionToken; // Adjust the type according to your payload
	}
}
