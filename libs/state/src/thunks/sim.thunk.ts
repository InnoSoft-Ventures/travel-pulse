import { createAsyncThunk } from '@reduxjs/toolkit';

import { ApiService } from '../request';
import {
	SIMDetails,
	SIMInfoResponse,
	SuccessResponse,
	PackageHistoryResponse,
} from '@travelpulse/interfaces';

export const fetchSims = createAsyncThunk<
	SIMInfoResponse['items'],
	{ size?: number; page?: number },
	{ rejectValue: string }
>('sim/fetchSims', async (params, { rejectWithValue }) => {
	try {
		const res = await ApiService.get('/api/esims', {
			params: {
				status: 'all',
				page: params.page || 1,
				size: params.size || 100,
			},
		});
		const parsed = res.data as SuccessResponse<SIMInfoResponse>;

		return parsed.data.items || [];
	} catch (err) {
		console.error('Failed to load eSIMs', err);
		return rejectWithValue('Failed to load eSIMs');
	}
});

export const fetchSimDetails = createAsyncThunk<
	SIMDetails,
	{ simId: string },
	{ rejectValue: string }
>('sim/fetchSimDetails', async ({ simId }, { rejectWithValue }) => {
	try {
		const res = await ApiService.get<SuccessResponse<SIMDetails>>(
			`/api/esims/${simId}`
		);
		const parsed = res.data;

		return parsed.data;
	} catch (err) {
		console.error(`Failed to load eSIM details for SIM ID: ${simId}`, err);
		return rejectWithValue('Failed to load eSIM details');
	}
});

export const fetchPackageHistory = createAsyncThunk<
	PackageHistoryResponse,
	{ simId: number },
	{ rejectValue: string }
>('sim/fetchPackageHistory', async ({ simId }, { rejectWithValue }) => {
	try {
		const res = await ApiService.get<
			SuccessResponse<PackageHistoryResponse>
		>(`/api/esims/${simId}/package-history`);
		const parsed = res.data;

		return parsed.data;
	} catch (err) {
		console.error(
			`Failed to load package history for SIM ID: ${simId}`,
			err
		);
		return rejectWithValue('Failed to load package history');
	}
});
