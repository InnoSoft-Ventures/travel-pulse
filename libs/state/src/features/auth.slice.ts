import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterFormValues } from '@travelpulse/interfaces/schemas';
import { forgotPassword, loginUser, registerUser } from '../thunks/auth.thunk';

interface AuthState {
	register: RegisterFormValues;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: AuthState = {
	register: {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	},
	status: 'idle',
	error: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setRegister: (state, action: PayloadAction<RegisterFormValues>) => {
			state.register = action.payload;
		},
		clearRegister: (state) => {
			state.register = initialState.register;
		},
		// setLogin: (
		// 	state,
		// 	action: PayloadAction<{ email: string; password: string }>
		// ) => {},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.status = 'succeeded';

				console.log('Registration successful:', action.payload);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// Login
			.addCase(loginUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = 'succeeded';

				console.log('Login successful', action.payload);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// Forgot Password
			.addCase(forgotPassword.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(forgotPassword.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const {} = authSlice.actions;
export default authSlice.reducer;
