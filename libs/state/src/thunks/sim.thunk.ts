import { createAsyncThunk } from '@reduxjs/toolkit';

import { ApiService } from '../request';
import {
	SIMDetails,
	SIMInfoResponse,
	SuccessResponse,
} from '@travelpulse/interfaces';

export const fetchSims = createAsyncThunk<
	SIMInfoResponse['items'],
	void,
	{ rejectValue: string }
>('sim/fetchSims', async (_, { rejectWithValue }) => {
	try {
		const res = await ApiService.get('/api/esims', {
			params: { status: 'all', page: 1, size: 20 },
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
