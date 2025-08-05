import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	CountryProduct,
	ErrorHandler,
	ItemState,
	ListState,
	PackageResults,
	SelectedSearchDataState,
} from '@travelpulse/interfaces';
import {
	getMultipleRegions,
	getPopularDestinations,
	productSearch,
} from '../thunks/product.thunk';
import {
	createInitialItemState,
	createInitialListState,
	DATE_FORMAT,
	dateJs,
	formatApiErrorDescription,
	toast,
} from '@travelpulse/utils';

interface ProductState {
	searchData: SelectedSearchDataState;
	popularDestinations: ListState<CountryProduct>;
	multipleRegions: ListState<CountryProduct>;
	productSearch: ItemState<PackageResults>;
}

const date = dateJs();

const initialState: ProductState = {
	searchData: {
		country: null,
		dates: [
			date.format(DATE_FORMAT),
			date.add(7, 'days').format(DATE_FORMAT),
		],
	},
	productSearch: createInitialItemState<PackageResults>({
		packages: null,
		destinationType: 'local',
		travelDuration: 0,
	}),
	popularDestinations: createInitialListState<CountryProduct>(),
	multipleRegions: createInitialListState<CountryProduct>(),
};

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setSearchData: (
			state,
			action: PayloadAction<SelectedSearchDataState>
		) => {
			state.searchData = action.payload;
		},
		resetSearchData: (state) => {
			state.searchData = initialState.searchData;
		},
		resetProductSearch: (state) => {
			state.productSearch = initialState.productSearch;
		},
	},
	extraReducers: (builder) => {
		builder
			// Popular Destinations
			.addCase(getPopularDestinations.pending, (state) => {
				state.popularDestinations.status = 'loading';
				state.popularDestinations.error = undefined;
			})
			.addCase(getPopularDestinations.fulfilled, (state, action) => {
				state.popularDestinations.status = 'succeeded';
				state.popularDestinations.list = action.payload;
			})
			.addCase(getPopularDestinations.rejected, (state, action) => {
				state.popularDestinations.status = 'failed';
				state.popularDestinations.error =
					action.payload as ErrorHandler;
			})

			// Multiple Regions
			.addCase(getMultipleRegions.pending, (state) => {
				state.multipleRegions.status = 'loading';
				state.multipleRegions.error = undefined;
			})
			.addCase(getMultipleRegions.fulfilled, (state, action) => {
				state.multipleRegions.status = 'succeeded';
				state.multipleRegions.list = action.payload;
			})
			.addCase(getMultipleRegions.rejected, (state, action) => {
				state.multipleRegions.status = 'failed';
				state.multipleRegions.error = action.payload as ErrorHandler;
			})

			// Product Search
			.addCase(productSearch.pending, (state) => {
				state.productSearch.status = 'loading';
				state.productSearch.error = undefined;
			})
			.addCase(productSearch.fulfilled, (state, action) => {
				state.productSearch.status = 'succeeded';
				state.productSearch.data = action.payload;
			})
			.addCase(productSearch.rejected, (state, action) => {
				state.productSearch.status = 'failed';
				const error = action.payload as ErrorHandler;

				state.productSearch.error = error;

				// Show error toast notification
				toast.error({
					title: 'Product Search Failed',
					description: formatApiErrorDescription(error),
				});
			});
	},
});

export const { setSearchData, resetSearchData, resetProductSearch } =
	productsSlice.actions;
export default productsSlice.reducer;
