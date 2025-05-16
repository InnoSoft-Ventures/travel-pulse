import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import user from './features/user.slice';
import auth from './features/auth.slice';
import masterData from './features/masterdata.slice';
import products from './features/products.slice';

export const rootReducer = combineReducers({
	user,
	auth,
	masterData,
	products,
});
