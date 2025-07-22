import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, ListState, PackageInterface } from '@travelpulse/interfaces';
import { createInitialListState } from '@travelpulse/utils';

interface CartState {
	items: ListState<CartItem>;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: CartState = {
	items: createInitialListState<CartItem>(),
	status: 'idle',
	error: null,
};

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

			const name = packageItem.continent
				? packageItem.continent.name
				: packageItem.countries[0].name;

			const cartItem: CartItem = {
				packageId: packageItem.packageId,
				name: `${name} eSIM`,
				flag:
					packageItem.countries.length === 1
						? packageItem.countries[0].flag
						: '',
				data: packageItem.data,
				validity: `${packageItem.day} Days`,
				startDate,
				finalPrice: packageItem.price,
				quantity: 1,
			};

			const existingItem = state.items.list.find(
				(item) => item.packageId === packageItem.packageId
			);
			if (existingItem) {
				existingItem.quantity += 1;
			} else {
				state.items.list.push(cartItem);
			}
		},
		removeFromCart: (
			state,
			action: PayloadAction<Pick<CartItem, 'packageId'>>
		) => {
			state.items.list = state.items.list.filter(
				(item) => item.packageId !== action.payload.packageId
			);
		},
		updateQuantity: (
			state,
			action: PayloadAction<Pick<CartItem, 'packageId' | 'quantity'>>
		) => {
			const item = state.items.list.find(
				(item) => item.packageId === action.payload.packageId
			);
			if (item) {
				item.quantity = action.payload.quantity;
			}
		},
		clearCart: (state) => {
			state.items = createInitialListState<CartItem>();
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
	cartSlice.actions;

export default cartSlice.reducer;
