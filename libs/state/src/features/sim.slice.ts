import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	ErrorHandler,
	ItemState,
	ListState,
	SIMDetails,
	SIMInfo,
} from '@travelpulse/interfaces';
import {
	createInitialItemState,
	createInitialListState,
} from '@travelpulse/utils';
import { fetchSimDetails, fetchSims } from '../thunks/sim.thunk';

interface EsimState {
	sims: ListState<SIMInfo>;
	simDetails: ItemState<SIMDetails | null>;
}

const initialState: EsimState = {
	sims: createInitialListState<SIMInfo>(),
	simDetails: createInitialItemState<SIMDetails | null>(null),
};

const simsSlice = createSlice({
	name: 'sims',
	initialState,
	reducers: {
		// activateEsim(state, action: PayloadAction<{ phoneNumber: string; activationDate: string }>) {
		// 	state.isActive = true;
		// 	state.phoneNumber = action.payload.phoneNumber;
		// 	state.activationDate = action.payload.activationDate;
		// 	state.error = null;
		// },
		// deactivateEsim(state) {
		// 	state.isActive = false;
		// 	state.phoneNumber = null;
		// 	state.activationDate = null;
		// 	state.error = null;
		// },
		// setEsimError(state, action: PayloadAction<string>) {
		// 	state.error = action.payload;
		// },
		// clearEsimError(state) {
		// 	state.error = null;
		// },
	},
	extraReducers: (builder) => {
		builder.addCase(fetchSims.pending, (state) => {
			state.sims.status = 'loading';
			state.sims.error = undefined;
		});
		builder.addCase(
			fetchSims.fulfilled,
			(state, action: PayloadAction<SIMInfo[]>) => {
				state.sims.status = 'succeeded';
				state.sims.list = action.payload;
			}
		);
		builder.addCase(fetchSims.rejected, (state, action) => {
			state.sims.status = 'failed';
			state.sims.error = action.payload as ErrorHandler;
		});

		builder.addCase(fetchSimDetails.pending, (state) => {
			state.simDetails.status = 'loading';
			state.simDetails.error = undefined;
		});
		builder.addCase(
			fetchSimDetails.fulfilled,
			(state, action: PayloadAction<SIMDetails>) => {
				state.simDetails.status = 'succeeded';
				state.simDetails.data = action.payload;
			}
		);
		builder.addCase(fetchSimDetails.rejected, (state, action) => {
			state.simDetails.status = 'failed';
			state.simDetails.error = action.payload as ErrorHandler;
		});
	},
});

// export const { activateSim, deactivateSim, setSimError, clearSimError } = simsSlice.actions;
export default simsSlice.reducer;
