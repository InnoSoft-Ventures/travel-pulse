'use client';

import { ToastProvider } from '@travelpulse/utils';
import { UIProvider } from '@travelpulse/ui';
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

	const toastPlacement = 'top-center';

	if (!ref.current) {
		ref.current = store.store;
	}

	// Uncomment this to clear the store on each reload
	// store.persistor.purge();

	return (
		<ReduxProvider store={ref.current}>
			<PersistGate loading={null} persistor={store.persistor}>
				<UIProvider>
					<ToastProvider
						placement={toastPlacement}
						toastOffset={toastPlacement.includes('top') ? 20 : 0}
					/>
					{children}
				</UIProvider>
			</PersistGate>
		</ReduxProvider>
	);
}
