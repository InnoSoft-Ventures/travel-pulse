import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../request/request';
import {
	OrderDetailResponse,
	OrderResponse,
	ResponseData,
} from '@travelpulse/interfaces';
import { DEFAULT_CURRENCY_CODE, errorHandler } from '@travelpulse/utils';
import type {
	PaymentAttemptResponse,
	PaymentMethod,
	PaymentProvider,
} from '@travelpulse/interfaces';
import { RootState } from '../store';
import { CreateOrderPayload } from '@travelpulse/interfaces/schemas';

export const createOrder = createAsyncThunk<
	OrderResponse,
	void,
	{ state: RootState }
>('orders/create', async (_, thunkAPI) => {
	const state = thunkAPI.getState();

	// Build payload from cart
	const packages: CreateOrderPayload['packages'] =
		state.app.cart.items.list.map((item) => ({
			packageId: item.packageId,
			startDate: item.startDate,
			quantity: item.quantity,
		}));

	if (!packages.length) {
		return thunkAPI.rejectWithValue(
			errorHandler(
				{ message: 'Your cart is empty' },
				'Your cart is empty'
			)
		);
	}

	// TODO: Replace with selected currency code from user/settings.
	const currency = DEFAULT_CURRENCY_CODE;

	try {
		const response = await ApiService.post<ResponseData<OrderResponse>>(
			'/api/orders',
			{ packages, currency }
		);

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to create order')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error during order creation')
		);
	}
});

export const fetchOrders = createAsyncThunk<
	OrderDetailResponse[],
	void,
	{ state: RootState }
>('orders/fetchAll', async (_, thunkAPI) => {
	try {
		const response = await ApiService.get<
			ResponseData<OrderDetailResponse[]>
		>('/api/orders');

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to fetch orders')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error while fetching orders')
		);
	}
});

export const fetchOrderById = createAsyncThunk<
	OrderDetailResponse,
	number,
	{ state: RootState }
>('orders/fetchOne', async (orderId, thunkAPI) => {
	try {
		const response = await ApiService.get<
			ResponseData<OrderDetailResponse>
		>(`/api/orders/${orderId}`);

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to fetch order')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error while fetching order')
		);
	}
});

export const createPaymentAttempt = createAsyncThunk<
	PaymentAttemptResponse,
	{
		orderId: number;
		provider: PaymentProvider;
		method: PaymentMethod;
		currency: string;
	}
>('orders/createPaymentAttempt', async (payload, thunkAPI) => {
	try {
		const { orderId, provider, method, currency } = payload;

		const response = await ApiService.post<
			ResponseData<PaymentAttemptResponse>
		>(`/api/orders/${orderId}/payments`, {
			provider,
			method,
			currency,
		});

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to create payment attempt')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error creating payment attempt')
		);
	}
});

export const reInitiatePaymentAttempt = createAsyncThunk<
	PaymentAttemptResponse,
	{
		orderId: number;
	}
>('orders/reInitiatePaymentAttempt', async (payload, thunkAPI) => {
	try {
		const { orderId } = payload;

		const response = await ApiService.post<
			ResponseData<PaymentAttemptResponse>
		>(`/api/orders/${orderId}/payments/re-initiate-attempt`);

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to re-initiate payment attempt')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(
				error,
				'Unexpected error re-initiating payment attempt'
			)
		);
	}
});

export const chargePaymentCardThunk = createAsyncThunk<
	boolean,
	{
		paymentAttemptId: number;
		orderId: number;
		paymentCardId: number;
	},
	{ state: RootState }
>('orders/chargePaymentCard', async (payload, thunkAPI) => {
	try {
		const { paymentAttemptId, orderId, paymentCardId } = payload;

		const response = await ApiService.post<ResponseData<boolean>>(
			`/api/orders/${orderId}/payments/${paymentAttemptId}/charge`,
			{
				paymentCardId,
			}
		);

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to charge payment card')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error charging payment card')
		);
	}
});
