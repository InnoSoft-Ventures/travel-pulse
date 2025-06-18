import { createSlice } from '@reduxjs/toolkit';
import {
	CountryProduct,
	PackageResults,
	StateStatus,
} from '@travelpulse/interfaces';
import {
	getMultipleRegions,
	getPopularDestinations,
	productSearch,
} from '../thunks/product.thunk';

interface ProductState {
	popularDestinations: {
		list: CountryProduct[];
		status: StateStatus;
		error: string | null;
	};
	productSearch: {
		data: PackageResults;
		status: StateStatus;
		error: string | null;
	};
	multipleRegions: {
		list: CountryProduct[];
		status: StateStatus;
		error: string | null;
	};
}

const initialState: ProductState = {
	productSearch: {
		data: {
			destinations: null,
			travelDuration: 0,
		},
		status: 'idle',
		error: null,
	},
	popularDestinations: {
		list: [],
		status: 'idle',
		error: null,
	},
	multipleRegions: {
		list: [],
		status: 'idle',
		error: null,
	},
};

const productSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Popular Destinations
			.addCase(getPopularDestinations.pending, (state) => {
				state.popularDestinations.status = 'loading';
				state.popularDestinations.error = null;
			})
			.addCase(getPopularDestinations.fulfilled, (state, action) => {
				state.popularDestinations.status = 'succeeded';
				state.popularDestinations.list = action.payload;
			})
			.addCase(getPopularDestinations.rejected, (state, action) => {
				state.popularDestinations.status = 'failed';
				state.popularDestinations.error = action.payload as string;
			})

			// Multiple Regions
			.addCase(getMultipleRegions.pending, (state) => {
				state.multipleRegions.status = 'loading';
				state.multipleRegions.error = null;
			})
			.addCase(getMultipleRegions.fulfilled, (state, action) => {
				state.multipleRegions.status = 'succeeded';
				state.multipleRegions.list = action.payload;
			})
			.addCase(getMultipleRegions.rejected, (state, action) => {
				state.multipleRegions.status = 'failed';
				state.multipleRegions.error = action.payload as string;
			})

			// Product Search
			.addCase(productSearch.pending, (state) => {
				state.productSearch.status = 'loading';
				state.productSearch.error = null;
			})
			.addCase(productSearch.fulfilled, (state, action) => {
				state.productSearch.status = 'succeeded';
				state.productSearch.data = action.payload;
			})
			.addCase(productSearch.rejected, (state, action) => {
				state.productSearch.status = 'failed';

				console.log('Error in product search:', action.payload);

				state.productSearch.error = action.payload as string;
			});
	},
});

export const {} = productSlice.actions;
export default productSlice.reducer;
