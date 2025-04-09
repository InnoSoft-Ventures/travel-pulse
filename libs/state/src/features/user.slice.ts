import { createSlice } from '@reduxjs/toolkit';

interface UserState {
	name: string | null;
}

const initialState: UserState = {
	name: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.name = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
