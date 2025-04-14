export interface SessionToken {
	accountId: number;
	iat?: number;
	exp?: number;
}

export type SignToken = SessionToken;

export interface UserResponseData {
	userId: number;
	username: string;
	email: string;
	picture: string;
}

export interface UserSessionData {
	user: UserResponseData;
	token: string;
}

export interface UserDataDAO {
	user: {
		accountId: number;
		firstName: string;
		lastName: string;
		email: string;
		registrationDate: string;
	};
	token: {
		accessToken: string;
	};
}
