import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetadataState {
	dates: {
		start: string;
		end: string;
	};
}

const initialState: MetadataState = {
	dates: {
		start: '',
		end: '',
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
