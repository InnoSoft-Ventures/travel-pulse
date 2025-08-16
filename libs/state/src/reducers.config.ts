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

const persistedMetaDataReducer = persistReducer(
	{
		key: 'metaData',
		storage,
		blacklist: ['dates'],
	},
	metaData
);

// Account related reducers
const accountReducer = combineReducers({
	user,
});

// App related reducers
const appReducer = combineReducers({
	auth,
	cart,
	masterData,
	products: persistedProductsReducer,
	metaData: persistedMetaDataReducer,
});

// Persist account reducers separately
const accountPersistConfig = {
	key: 'account',
	storage,
};
const persistedAccountReducer = persistReducer(
	accountPersistConfig,
	accountReducer
);

// Persist app reducers separately
const appPersistConfig = {
	key: 'app',
	storage,
	blacklist: ['auth'],
	whitelist: ['cart'],
};
const persistedAppReducer = persistReducer(appPersistConfig, appReducer);

// Root reducer with two domains
export const rootReducer = combineReducers({
	account: persistedAccountReducer,
	app: persistedAppReducer,
});
