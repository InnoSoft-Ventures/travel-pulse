import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../request/request';
import { ResponseData, UserDataDAO } from '@travelpulse/interfaces';
import { errorHandler } from '@travelpulse/utils';
import { setUser } from '../features/user.slice';
import { UpdateProfile } from '@travelpulse/interfaces/schemas';

export const fetchAccount = createAsyncThunk(
	'account/fetch',
	async (_, thunkAPI) => {
		try {
			const res = await ApiService.get<
				ResponseData<{ user: UserDataDAO['user'] }>
			>('/account/me');
			const results = res.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					errorHandler(results, 'Failed to fetch account')
				);
			}

			// Normalize to UserDataDAO shape by wrapping in { user }
			thunkAPI.dispatch(
				setUser({ user: results.data.user } as UserDataDAO)
			);
			return results.data.user;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(
				errorHandler(err, 'Unexpected error fetching account')
			);
		}
	}
);

export const updateAccount = createAsyncThunk(
	'account/update',
	async (data: UpdateProfile, thunkAPI) => {
		try {
			const res = await ApiService.patch<
				ResponseData<{ user: UserDataDAO['user'] }>
			>('/account/me', data);
			const results = res.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					errorHandler(results, 'Failed to update account')
				);
			}

			thunkAPI.dispatch(
				setUser({ user: results.data.user } as UserDataDAO)
			);
			return results.data.user;
		} catch (err: any) {
			return thunkAPI.rejectWithValue(
				errorHandler(err, 'Unexpected error updating account')
			);
		}
	}
);
