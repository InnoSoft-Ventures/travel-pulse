import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../request';
import { Continent, Country, ResponseData } from '@travelpulse/interfaces';
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

export const getPopularCountries = createAsyncThunk(
	'getPopularCountries',
	async () => {
		try {
			const response = await ApiService.get<ResponseData<Country[]>>(
				'/data/popular-countries'
			);
			const results = response.data;

			if (!results.success) {
				throw new Error('Failed fetching popular countries');
			}

			return results.data;
		} catch (error: any) {
			console.error('Failed fetching popular countries', error);
			throw error;
		}
	}
);

export const getRegions = createAsyncThunk(
	'getRegions',
	async ({ size }: { size?: number }) => {
		try {
			const response = await ApiService.get<ResponseData<Continent[]>>(
				'/data/regions',
				{
					params: {
						size,
					},
				}
			);
			const results = response.data;

			if (!results.success) {
				throw new Error('Failed fetching regions');
			}

			return results.data;
		} catch (error: any) {
			console.error('Failed fetching regions', error);
			throw error;
		}
	}
);
