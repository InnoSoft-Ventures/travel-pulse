import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDataDAO } from '@travelpulse/interfaces';

interface UserState {
	account: UserDataDAO['user'];
}

const initialState: UserState = {
	account: {
		accountId: 0,
		firstName: '',
		lastName: '',
		email: '',
		registrationDate: '',
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserDataDAO>) {
			state.account = action.payload.user;
		},
	},
	selectors: {
		getAccount: (state: UserState) => state.account,
		sessionValid: (state: UserState) => Boolean(state.account.accountId),
	},
});

export const { setUser } = userSlice.actions;

export const { getAccount, sessionValid } = userSlice.selectors;

export default userSlice.reducer;
