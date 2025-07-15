import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterFormValues } from '@travelpulse/interfaces/schemas';
import { ApiService } from '../request';
import { setUser } from '../features/user.slice';
import { ResponseData, UserDataDAO } from '@travelpulse/interfaces';
import { errorHandler } from '@travelpulse/utils';

export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async (formData: RegisterFormValues, thunkAPI) => {
		try {
			const response = await ApiService.post<ResponseData<UserDataDAO>>(
				'/auth/signup',
				formData
			);
			const results = response.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					errorHandler(results, 'Failed to register user')
				);
			}

			thunkAPI.dispatch(setUser(results.data));

			return results.data;
		} catch (error: any) {
			console.log('Registration error:', error);

			return thunkAPI.rejectWithValue(
				errorHandler(error, 'Unexpected error during registration')
			);
		}
	}
);

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (data: { email: string; password: string }, thunkAPI) => {
		try {
			const res = await ApiService.post<ResponseData<UserDataDAO>>(
				'/auth/signin',
				data
			);
			const results = res.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					errorHandler(results, 'Failed to login user')
				);
			}

			thunkAPI.dispatch(setUser(results.data));

			return results.data;
		} catch (err: any) {
			console.log('Signin error:', err);

			return thunkAPI.rejectWithValue(
				errorHandler(err, 'Unexpected error during signin')
			);
		}
	}
);

export const forgotPassword = createAsyncThunk(
	'auth/forgotPassword',
	async (data: { email: string }, thunkAPI) => {
		try {
			const res = await ApiService.post('/auth/forgot-password', data);
			return res.data;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(
				errorHandler(
					err,
					'Unexpected error during forgot password process'
				)
			);
		}
	}
);
