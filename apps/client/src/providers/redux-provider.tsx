'use client';

import {
	ReduxProvider,
	AppStore,
	makeStore,
	PersistGate,
} from '@travelpulse/ui/state';
import { useRef } from 'react';

export default function StoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const ref = useRef<AppStore | undefined>(undefined);
	const store = makeStore();

	if (!ref.current) {
		ref.current = store.store;
	}

	// Uncomment this to clear the store on each reload
	// store.persistor.purge();

	return (
		<ReduxProvider store={ref.current}>
			<PersistGate loading={null} persistor={store.persistor}>
				{children}
			</PersistGate>
		</ReduxProvider>
	);
}
