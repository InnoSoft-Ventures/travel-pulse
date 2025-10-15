import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../request/request';
import { CartDetails, ResponseData } from '@travelpulse/interfaces';
import { errorHandler } from '@travelpulse/utils';
import { RootState } from '../store';
import { Cart } from '@travelpulse/interfaces/schemas';

export const processCart = createAsyncThunk<
	CartDetails,
	void,
	{ state: RootState }
>('cart/process', async (_, thunkAPI) => {
	const state = thunkAPI.getState();

	const items: Cart['items'] = state.app.cart.items.list.map((item) => ({
		packageId: item.packageId,
		name: item.name,
		flag: item.flag,
		startDate: item.startDate,
		quantity: item.quantity,
	}));

	try {
		const response = await ApiService.post<ResponseData<CartDetails>>(
			'/api/cart',
			{ items }
		);

		const results = response.data;

		if (!results.success) {
			return thunkAPI.rejectWithValue(
				errorHandler(results, 'Failed to process cart')
			);
		}

		return results.data;
	} catch (error) {
		console.log('Cart processing error:', error);

		return thunkAPI.rejectWithValue(
			errorHandler(error, 'Unexpected error during cart processing')
		);
	}
});
