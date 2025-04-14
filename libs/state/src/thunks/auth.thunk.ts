import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterFormValues } from '@travelpulse/interfaces/schemas';
import ApiService from '../request';
import { setUser } from '../features/user.slice';
import { ResponseData, UserDataDAO } from '@travelpulse/interfaces';

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
					results.message || 'Registration failed'
				);
			}

			thunkAPI.dispatch(setUser(results.data));

			return results.data;
		} catch (error: any) {
			console.log('Registration error:', error);

			return thunkAPI.rejectWithValue(
				error.response?.data || 'Registration failed'
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
					results.message || 'Signin failed'
				);
			}

			thunkAPI.dispatch(setUser(results.data));

			return results.data;
		} catch (err: any) {
			console.log('Signin error:', err);

			return thunkAPI.rejectWithValue(
				err.response?.data || 'Signin failed'
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
				err.response?.data || 'Failed to send reset email'
			);
		}
	}
);
