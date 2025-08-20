import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { rootReducer } from './reducers.config';
import { storeRef } from './storeRef';

export const makeStore = () => {
	// const persistedReducer = persistReducer(
	// 	{
	// 		key: 'root',
	// 		storage,
	// 	},
	// 	rootReducer
	// );

	const rootWithReset = (state: any, action: any) => {
		if (action.type === 'auth/logout') {
			// Keep app branch; reset account
			state = { ...state, account: undefined };
		}
		return rootReducer(state, action);
	};

	const store = configureStore({
		reducer: rootWithReset,
		// @ts-ignore
		devTools: process.env.NODE_ENV !== 'production',
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
				},
			}),
	});

	// expose store to non-React modules (e.g., axios interceptors)
	storeRef.set(store);

	const persistor = persistStore(store);

	return {
		store,
		persistor,
	};
};

export type AppStore = ReturnType<typeof makeStore>['store'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
