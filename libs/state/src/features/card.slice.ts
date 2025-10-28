import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	ErrorHandler,
	ListState,
	PaymentCardPayload,
} from '@travelpulse/interfaces';
import { createInitialListState } from '@travelpulse/utils';
import { fetchCards } from '../thunks/cards.thunk';

export interface CardsState {
	items: ListState<PaymentCardPayload>;
}

const initialState: CardsState = {
	items: createInitialListState<PaymentCardPayload>(),
};

const cardsSlice = createSlice({
	name: 'cards',
	initialState,
	reducers: {
		/** Remove a card by its index */
		removeCard(state, action: PayloadAction<number>) {
			const idx = action.payload;

			state.items.list.splice(idx, 1);
		},
		/** Mark a card as default using index */
		markDefaultCard(state, action: PayloadAction<number>) {
			const idx = action.payload;

			state.items.list.forEach((card, i) => {
				card.isDefault = i === idx;
			});
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCards.pending, (state) => {
			state.items.status = 'loading';
			state.items.error = undefined;
		});

		builder.addCase(fetchCards.fulfilled, (state, action) => {
			state.items.list = action.payload;
			state.items.status = 'succeeded';
		});

		builder.addCase(fetchCards.rejected, (state, action) => {
			state.items.status = 'failed';
			state.items.error = action.payload as ErrorHandler;
		});
	},
});

export const { removeCard, markDefaultCard } = cardsSlice.actions;

export default cardsSlice.reducer;
