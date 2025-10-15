import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorHandler, ItemState, UserDataDAO } from '@travelpulse/interfaces';
import { updateAccount } from '../thunks';
import { createInitialItemState } from '@travelpulse/utils';

interface UserState {
	session: ItemState<UserDataDAO['user']>;
}

const initialState: UserState = {
	session: createInitialItemState<UserDataDAO['user']>({
		accountId: 0,
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		registrationDate: '',
		picture: 'https://randomuser.me/api/portraits/lego/1.jpg',
		isActivated: false,
		country: null,
	}),
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserDataDAO>) {
			state.session.data = action.payload.user;
		},
	},
	selectors: {
		getAccount: (state: UserState) => state.session,
		sessionValid: (state: UserState) =>
			Boolean(state.session.data.accountId),
	},
	extraReducers: (builder) => {
		builder

			// Account update
			.addCase(updateAccount.pending, (state) => {
				state.session.status = 'loading';
				state.session.error = undefined;
			})
			.addCase(updateAccount.fulfilled, (state, action) => {
				state.session.status = 'succeeded';
				state.session.data = action.payload;
			})
			.addCase(updateAccount.rejected, (state, action) => {
				state.session.status = 'failed';
				state.session.error = action.payload as ErrorHandler;
			});
	},
});

export const { setUser } = userSlice.actions;

export const { getAccount, sessionValid } = userSlice.selectors;

export default userSlice.reducer;
