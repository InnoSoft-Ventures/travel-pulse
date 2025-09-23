'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, clearCart } from '@travelpulse/ui/state';

const CLEAR_FLAG = 'tp:clearCartOnOrders';

export default function CartClearOnOrders() {
	const pathname = usePathname();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!pathname || !pathname.startsWith('/app/settings/orders')) return;
		try {
			const flag = sessionStorage.getItem(CLEAR_FLAG);
			if (flag) {
				dispatch(clearCart());
				sessionStorage.removeItem(CLEAR_FLAG);
			}
		} catch {
			// ignore storage access errors (e.g., SSR or privacy mode)
		}
	}, [pathname, dispatch]);

	return null;
}
