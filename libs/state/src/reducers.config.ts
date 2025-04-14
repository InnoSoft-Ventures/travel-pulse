import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import user from './features/user.slice';
import auth from './features/auth.slice';

export const rootReducer = combineReducers({
	user,
	auth,
});
