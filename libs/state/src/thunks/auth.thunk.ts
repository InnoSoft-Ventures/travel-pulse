import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterFormValues } from '@travelpulse/interfaces/schemas';
import ApiService from '../request';

export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async (formData: RegisterFormValues, thunkAPI) => {
		try {
			const response = await ApiService.post('/register', formData);
			return response.data;
		} catch (error: any) {
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
			const res = await ApiService.post('/login', data);
			return res.data;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(
				err.response?.data || 'Login failed'
			);
		}
	}
);

export const forgotPassword = createAsyncThunk(
	'auth/forgotPassword',
	async (data: { email: string }, thunkAPI) => {
		try {
			const res = await ApiService.post('/forgot-password', data);
			return res.data;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(
				err.response?.data || 'Failed to send reset email'
			);
		}
	}
);
