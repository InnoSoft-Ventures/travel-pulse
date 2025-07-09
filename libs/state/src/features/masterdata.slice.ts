import { createSlice } from '@reduxjs/toolkit';
import {
	Continent,
	Country,
	ErrorHandler,
	ListState,
} from '@travelpulse/interfaces';
import {
	getCountries,
	getPopularCountries,
	getRegions,
} from '../thunks/masterdata.thunk';
import { createInitialListState } from '@travelpulse/utils';

interface MasterDataState {
	countries: ListState<Country>;
	popularCountries: ListState<Country>;
	regions: ListState<Continent>;
}

const initialState: MasterDataState = {
	countries: createInitialListState<Country>(),
	popularCountries: createInitialListState<Country>(),
	regions: createInitialListState<Continent>(),
};

const masterDataSlice = createSlice({
	name: 'master-data',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder

			// All countries
			.addCase(getCountries.pending, (state) => {
				state.countries.status = 'loading';
				state.countries.error = undefined;
			})
			.addCase(getCountries.fulfilled, (state, action) => {
				state.countries.status = 'succeeded';
				state.countries.list = action.payload;
			})
			.addCase(getCountries.rejected, (state, action) => {
				state.countries.status = 'failed';
				state.countries.error = action.payload as ErrorHandler;
			})

			// Popular countries
			.addCase(getPopularCountries.pending, (state) => {
				state.popularCountries.status = 'loading';
				state.popularCountries.error = undefined;
			})
			.addCase(getPopularCountries.fulfilled, (state, action) => {
				state.popularCountries.status = 'succeeded';
				state.popularCountries.list = action.payload;
			})
			.addCase(getPopularCountries.rejected, (state, action) => {
				state.popularCountries.status = 'failed';
				state.popularCountries.error = action.payload as ErrorHandler;
			})

			// Regions
			.addCase(getRegions.pending, (state) => {
				state.regions.status = 'loading';
				state.regions.error = undefined;
			})
			.addCase(getRegions.fulfilled, (state, action) => {
				state.regions.status = 'succeeded';
				state.regions.list = action.payload;
			})
			.addCase(getRegions.rejected, (state, action) => {
				state.regions.status = 'failed';
				state.regions.error = action.payload as ErrorHandler;
			});
	},
});

export default masterDataSlice.reducer;
