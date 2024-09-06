export interface SessionToken {
	accountId: number;
	iat?: number;
	exp?: number;
}

export type SignToken = SessionToken;
