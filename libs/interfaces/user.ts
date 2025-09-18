import { Country } from './common';

export interface SessionToken {
	accountId: number;
	email: string;
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
		phoneNumber: string;
		registrationDate: string;
		picture: string;
		country: Pick<Country, 'id' | 'name' | 'iso2' | 'flag'> | null;
	};
	token: {
		accessToken: string;
	};
}
