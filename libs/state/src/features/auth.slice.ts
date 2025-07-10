import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterFormValues } from '@travelpulse/interfaces/schemas';
import { forgotPassword, loginUser, registerUser } from '../thunks/auth.thunk';
import {
	ErrorHandler,
	ErrorInstance,
	StateStatus,
} from '@travelpulse/interfaces';

interface AuthState {
	register: RegisterFormValues;
	status: StateStatus;
	error: ErrorInstance;
}

const initialState: AuthState = {
	register: {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	},
	status: 'idle',
	error: undefined,
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

			// Register
			.addCase(registerUser.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as ErrorHandler;
			})

			// Login
			.addCase(loginUser.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(loginUser.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as ErrorHandler;
			})

			// Forgot Password
			.addCase(forgotPassword.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(forgotPassword.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as ErrorHandler;
			});
	},
});

export const {} = authSlice.actions;
export default authSlice.reducer;
