import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';

// Reducers
import user from './features/user.slice';
import auth from './features/auth.slice';
import masterData from './features/masterdata.slice';
import products from './features/products.slice';
import { persistReducer } from 'redux-persist';

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
});
