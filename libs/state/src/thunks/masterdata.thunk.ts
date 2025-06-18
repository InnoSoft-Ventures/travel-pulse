import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../request';
import { Country, ResponseData } from '@travelpulse/interfaces';
import { errorHandler } from '@travelpulse/utils';

export const getCountries = createAsyncThunk(
	'getAllCountries',
	async (query: string, thunkAPI) => {
		try {
			const response = await ApiService.get<ResponseData<Country[]>>(
				'/data/countries',
				{
					params: {
						query,
					},
				}
			);
			const results = response.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					errorHandler(results, 'Failed fetching countries')
				);
			}

			return results.data;
		} catch (error: any) {
			console.error('Failed fetching countries', error);

			return thunkAPI.rejectWithValue(
				errorHandler(error, 'Unexpected error fetching countries')
			);
		}
	}
);
