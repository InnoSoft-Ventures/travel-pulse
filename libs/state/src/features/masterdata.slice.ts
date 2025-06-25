import { createSlice } from '@reduxjs/toolkit';
import { Country, ErrorHandler, ListState } from '@travelpulse/interfaces';
import { getCountries } from '../thunks/masterdata.thunk';
import { createInitialListState } from '@travelpulse/utils';

interface MasterDataState {
	countries: ListState<Country>;
}

const initialState: MasterDataState = {
	countries: createInitialListState<Country>(),
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
			});
	},
});

export default masterDataSlice.reducer;
