import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import user from './features/user.slice';

export const rootReducer = combineReducers({
	user,
});
