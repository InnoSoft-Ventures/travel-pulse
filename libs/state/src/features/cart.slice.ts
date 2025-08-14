import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	CartDetails,
	CartItem,
	ErrorHandler,
	ListState,
	PackageInterface,
} from '@travelpulse/interfaces';
import {
	createInitialListState,
	DEFAULT_CURRENCY,
	toCurrency,
	toDecimalPoints,
} from '@travelpulse/utils';
import { processCart } from '../thunks';

export interface CartState extends Omit<CartDetails, 'items'> {
	items: ListState<CartItem>;
}

const initialState: CartState = {
	items: createInitialListState<CartItem>(),
	details: {
		subtotal: toCurrency('0.00', DEFAULT_CURRENCY),
		discount: 0,
		bundleDiscount: 0,
		taxesAndFees: '',
		total: 0,
		totalPrice: toCurrency('0.00', DEFAULT_CURRENCY),
		currency: DEFAULT_CURRENCY,
	},
};

const quantity = 1;

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (
			state,
			{
				payload,
			}: PayloadAction<{
				packageItem: PackageInterface;
				startDate: string;
			}>
		) => {
			const { packageItem, startDate } = payload;

			// const existingItem = state.items.list.find(
			// 	(item) => item.packageId === packageItem.packageId
			// );

			// if (existingItem) {
			// 	const quantity = existingItem.quantity + 1;

			// 	existingItem.finalPrice = toDecimalPoints(
			// 		packageItem.price * quantity,
			// 		DEFAULT_CURRENCY
			// 	);

			// 	existingItem.quantity = quantity;

			// 	return;
			// }

			const name = packageItem.continent
				? packageItem.continent.name
				: packageItem.countries[0].name;

			const cartItem: CartItem = {
				packageId: packageItem.packageId,
				name: name,
				flag:
					packageItem.countries.length === 1
						? packageItem.countries[0].flag
						: '',
				data: packageItem.data,
				validity: `${packageItem.day} Days`,
				startDate,
				finalPrice: toDecimalPoints(
					packageItem.price * quantity,
					DEFAULT_CURRENCY
				),
				originalPrice: packageItem.price,
				quantity,
			};

			state.items.list.push(cartItem);
		},
		removeFromCart: (state, action: PayloadAction<number>) => {
			state.items.list = state.items.list.filter(
				(_, index) => index !== action.payload
			);
		},
		updateQuantity: (
			state,
			action: PayloadAction<{ index: number; quantity: number }>
		) => {
			const item = state.items.list[action.payload.index];
			if (item) {
				item.quantity = action.payload.quantity;
			}
		},
		clearCart: (state) => {
			state.items = createInitialListState<CartItem>();
		},
	},
	extraReducers: (builder) => {
		builder.addCase(processCart.pending, (state) => {
			state.items.status = 'loading';
			state.items.error = undefined;
		});
		builder.addCase(processCart.fulfilled, (state, action) => {
			state.items.list = action.payload.items;
			state.details = action.payload.details;
			state.items.status = 'succeeded';
		});
		builder.addCase(processCart.rejected, (state, action) => {
			state.items.status = 'failed';
			state.items.error = action.payload as ErrorHandler;
		});
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
	cartSlice.actions;

export default cartSlice.reducer;
