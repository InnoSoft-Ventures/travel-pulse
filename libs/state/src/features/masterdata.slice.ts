import { createSlice } from '@reduxjs/toolkit';
import { Country, StateStatus } from '@travelpulse/interfaces';
import { getCountries } from '../thunks/masterdata.thunk';

interface MasterDataState {
	countries: {
		list: Country[];
		status: StateStatus;
		error: string | null;
	};
}

const initialState: MasterDataState = {
	countries: {
		list: [],
		status: 'idle',
		error: null,
	},
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
				state.countries.error = null;
			})
			.addCase(getCountries.fulfilled, (state, action) => {
				state.countries.status = 'succeeded';
				state.countries.list = action.payload;
			})
			.addCase(getCountries.rejected, (state, action) => {
				state.countries.status = 'failed';
				state.countries.error = action.payload as string;
			});
	},
});

export default masterDataSlice.reducer;
