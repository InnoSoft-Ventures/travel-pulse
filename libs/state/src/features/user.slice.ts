import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDataDAO } from '@travelpulse/interfaces';

interface UserState {
	session: UserDataDAO['user'];
}

const initialState: UserState = {
	session: {
		accountId: 0,
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		registrationDate: '',
		picture: 'https://randomuser.me/api/portraits/lego/1.jpg',
		country: null,
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserDataDAO>) {
			state.session = action.payload.user;
		},
	},
	selectors: {
		getAccount: (state: UserState) => state.session,
		sessionValid: (state: UserState) => Boolean(state.session.accountId),
	},
});

export const { setUser } = userSlice.actions;

export const { getAccount, sessionValid } = userSlice.selectors;

export default userSlice.reducer;
