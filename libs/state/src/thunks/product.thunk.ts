import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../request';
import { CountryProduct, ResponseData } from '@travelpulse/interfaces';

export const getPopularDestinations = createAsyncThunk(
	'products/getPopularDestinations',
	async (params: { countryISO?: string; size?: number }, thunkAPI) => {
		try {
			const response = await ApiService.get<
				ResponseData<CountryProduct[]>
			>(`/products/popular-destinations`, {
				params: {
					countryISO: params?.countryISO,
					size: params?.size,
				},
			});
			const results = response.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					results.message || 'Failed to fetch popular destinations'
				);
			}

			return results.data;
		} catch (error: any) {
			console.log('Error fetching popular destinations:', error);

			return thunkAPI.rejectWithValue(
				error.response?.data || 'Failed to fetch popular destinations'
			);
		}
	}
);

export const getMultipleRegions = createAsyncThunk(
	'products/getMultipleRegions',
	async (params: { size?: number }, thunkAPI) => {
		try {
			const response = await ApiService.get<
				ResponseData<CountryProduct[]>
			>(`/products/multiple-regions`, {
				params: {
					size: params?.size,
				},
			});
			const results = response.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					results.message || 'Failed to fetch multiple regions'
				);
			}

			return results.data;
		} catch (error: any) {
			console.log('Error fetching multiple regions:', error);

			return thunkAPI.rejectWithValue(
				error.response?.data || 'Failed to fetch multiple regions'
			);
		}
	}
);

export const productSearch = createAsyncThunk(
	'products/productSearch',
	async (params: { country: string; dates: string }, thunkAPI) => {
		try {
			const response = await ApiService.get<
				ResponseData<CountryProduct[]>
			>(`/products/search`, {
				params,
			});
			const results = response.data;

			if (!results.success) {
				return thunkAPI.rejectWithValue(
					results.message || 'Failed to fetch product search'
				);
			}

			return results.data;
		} catch (error: any) {
			console.log('Error fetching product search:', error);

			return thunkAPI.rejectWithValue(
				error.response?.data || 'Failed to fetch product search'
			);
		}
	}
);
