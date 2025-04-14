import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDataDAO } from '@travelpulse/interfaces';

interface UserState {
	account: UserDataDAO['user'];
	token: UserDataDAO['token'];
}

const initialState: UserState = {
	account: {
		accountId: 0,
		firstName: '',
		lastName: '',
		email: '',
		registrationDate: '',
	},
	token: {
		accessToken: '',
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserDataDAO>) {
			state.account = action.payload.user;
			state.token = action.payload.token;
		},
		updateToken(state, action: PayloadAction<string>) {
			state.token.accessToken = action.payload;
		},
	},
	selectors: {
		getAccount: (state: UserState) => state.account,
		getToken: (state: UserState) => state.token.accessToken,
		sessionValid: (state: UserState) => Boolean(state.token.accessToken),
	},
});

export const { setUser, updateToken } = userSlice.actions;

export const { getAccount, getToken, sessionValid } = userSlice.selectors;

export default userSlice.reducer;
