import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	ItemState,
	ListState,
	OrderDetailResponse,
	OrderResponse,
	ErrorHandler,
	PaymentAttemptResponse,
} from '@travelpulse/interfaces';
import {
	createInitialItemState,
	createInitialListState,
} from '@travelpulse/utils';
import {
	createOrder,
	fetchOrders,
	fetchOrderById,
	createPaymentAttempt,
} from '../thunks/order.thunk';

export interface OrdersState {
	create: ItemState<OrderResponse | null>;
	list: ListState<OrderDetailResponse>;
	paymentAttempt: ItemState<PaymentAttemptResponse | null>;
	confirmation: ItemState<{
		orderId: number;
		paymentId: number;
		orderStatus: string;
		paymentStatus: string;
		providerOrdersCreated: boolean;
		message?: string;
	} | null>;
	confirmationStep:
		| 'initial'
		| 'processing'
		| 'completed'
		| 'failed'
		| 'closed';
}

const initialState: OrdersState = {
	create: createInitialItemState<OrderResponse | null>(null),
	list: createInitialListState<OrderDetailResponse>(),
	paymentAttempt: createInitialItemState(null),
	confirmation: createInitialItemState(null),
	confirmationStep: 'initial',
};

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		resetCreate(state) {
			state.create = createInitialItemState<OrderResponse | null>(null);
		},
		updateConfirmationStep(
			state,
			action: PayloadAction<OrdersState['confirmationStep']>
		) {
			state.confirmationStep = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Create order
		builder.addCase(createOrder.pending, (state) => {
			state.create.status = 'loading';
			state.create.error = undefined;
		});
		builder.addCase(createOrder.fulfilled, (state, action) => {
			state.create.data = action.payload;
			state.create.status = 'succeeded';
		});
		builder.addCase(createOrder.rejected, (state, action) => {
			state.create.status = 'failed';
			state.create.error = action.payload as ErrorHandler;
		});

		// Fetch orders
		builder.addCase(fetchOrders.pending, (state) => {
			state.list.status = 'loading';
			state.list.error = undefined;
		});
		builder.addCase(fetchOrders.fulfilled, (state, action) => {
			state.list.list = action.payload;
			state.list.status = 'succeeded';
		});
		builder.addCase(fetchOrders.rejected, (state, action) => {
			state.list.status = 'failed';
			state.list.error = action.payload as ErrorHandler;
		});

		// Fetch single order
		builder.addCase(fetchOrderById.fulfilled, (state, action) => {
			const idx = state.list.list.findIndex(
				(o) => o.orderId === action.payload.orderId
			);
			if (idx >= 0) state.list.list[idx] = action.payload;
			else state.list.list.unshift(action.payload);
			if (state.list.status === 'idle') state.list.status = 'succeeded';
		});

		// Create payment attempt
		builder.addCase(createPaymentAttempt.pending, (state) => {
			state.paymentAttempt.status = 'loading';
			state.paymentAttempt.error = undefined;
		});
		builder.addCase(createPaymentAttempt.fulfilled, (state, action) => {
			state.paymentAttempt.data = action.payload;
			state.paymentAttempt.status = 'succeeded';
		});
		builder.addCase(createPaymentAttempt.rejected, (state, action) => {
			state.paymentAttempt.status = 'failed';
			state.paymentAttempt.error = action.payload as ErrorHandler;
		});
	},
});

export const { resetCreate, updateConfirmationStep } = ordersSlice.actions;

export default ordersSlice.reducer;
