import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// Reducers
import user from './features/user.slice';
import auth from './features/auth.slice';
import masterData from './features/masterdata.slice';
import products from './features/products.slice';
import metaData from './features/metadata.slice';
import cart from './features/cart.slice';

const persistedProductsReducer = persistReducer(
	{
		key: 'products',
		storage,
		blacklist: ['searchData', 'productSearch'],
	},
	products
);

export const rootReducer = combineReducers({
	user,
	auth,
	masterData,
	products: persistedProductsReducer,
	metaData,
	cart,
});
