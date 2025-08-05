import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DATE_FORMAT, dateJs } from '@travelpulse/utils';

interface MetadataState {
	dates: {
		start: string;
		end: string;
	};
}

const date = dateJs();

const initialState: MetadataState = {
	dates: {
		start: date.format(DATE_FORMAT),
		end: date.add(7, 'days').format(DATE_FORMAT),
	},
};

const metadataSlice = createSlice({
	name: 'metadata',
	initialState,
	reducers: {
		updateDates(state, action: PayloadAction<MetadataState['dates']>) {
			state.dates = action.payload;
		},
	},
});

export const { updateDates } = metadataSlice.actions;

export default metadataSlice.reducer;
