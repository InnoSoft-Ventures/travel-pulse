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
			'/orders',
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
		>('/orders');

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
		>(`/orders/${orderId}/payments`, {
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

export const confirmPayment = createAsyncThunk<
	{
		orderId: number;
		paymentId: number;
		orderStatus: string;
		paymentStatus: string;
		providerOrdersCreated: boolean;
		message?: string;
	},
	{ orderId: number; paymentId: number; referenceId?: string }
>('orders/confirmPayment', async (payload, thunkAPI) => {
	try {
		const { orderId, paymentId, referenceId } = payload;

		const response = await ApiService.post<
			ResponseData<{
				orderId: number;
				paymentId: number;
				orderStatus: string;
				paymentStatus: string;
				providerOrdersCreated: boolean;
				message?: string;
			}>
		>(`/orders/${orderId}/payments/${paymentId}/confirm`, {
			referenceId,
		});

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to confirm payment')
			);
		}

		return results.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error confirming payment')
		);
	}
});
