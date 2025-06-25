import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './reducers.config';

export const makeStore = () => {
	const persistedReducer = persistReducer(
		{
			key: 'root',
			storage,
		},
		rootReducer
	);

	const store = configureStore({
		reducer: persistedReducer,
		// @ts-ignore
		devTools: process.env.NODE_ENV !== 'production',
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
				},
			}),
	});

	const persistor = persistStore(store);

	return {
		store,
		persistor,
	};
};

export type AppStore = ReturnType<typeof makeStore>['store'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
