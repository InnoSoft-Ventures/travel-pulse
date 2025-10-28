import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorHandler } from '@travelpulse/utils';
import { ApiService } from '../request';
import {
	ErrorHandler,
	PaymentCardPayload,
	ResponseData,
} from '@travelpulse/interfaces';

export const fetchCards = createAsyncThunk<
	PaymentCardPayload[],
	void,
	{ rejectValue: ErrorHandler }
>('cards/fetchCards', async (_, thunkAPI) => {
	try {
		const response = await ApiService.get<
			ResponseData<PaymentCardPayload[]>
		>('/api/cards');
		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to fetch cards')
			);
		}

		return results.data;
	} catch (error) {
		console.error('Error fetching cards:', error);

		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Failed to fetch cards')
		);
	}
});

export const removeCardThunk = createAsyncThunk<
	boolean,
	number,
	{ rejectValue: ErrorHandler }
>('cards/removeCard', async (cardId, thunkAPI) => {
	try {
		const { data } = await ApiService.delete<ResponseData<boolean>>(
			`/api/cards/${cardId}`
		);
		if (!data.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(data, 'Failed to remove card')
			);
		}

		return data.data;
	} catch (error) {
		console.error('Error removing card:', error);

		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Failed to remove card')
		);
	}
});

export const markDefaultCardThunk = createAsyncThunk<
	boolean,
	number,
	{ rejectValue: ErrorHandler }
>('cards/markDefaultCard', async (cardId, thunkAPI) => {
	try {
		const { data } = await ApiService.post<ResponseData<boolean>>(
			`/api/cards/${cardId}/default`
		);
		if (!data.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(data, 'Failed to mark card as default')
			);
		}

		return data.data;
	} catch (error) {
		console.error('Error marking card as default:', error);

		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Failed to mark card as default')
		);
	}
});
