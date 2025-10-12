'use client';
import React from 'react';
import { Bell } from 'lucide-react';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';
import { AccountDropdown } from '../../common';
import { useAppSelector } from '@travelpulse/state';
import { CartIcon } from '../../common/icon';

const getTitleFromPath = (pathname: string): string => {
	if (pathname.includes('/app/orders/')) {
		return 'Order Details';
	}

	const titles: { [key: string]: string } = {
		'/app': 'Welcome back, Martin',
		'/app/account': 'Account Settings',
		'/app/account/security': 'Security Settings',
		'/app/account/notifications': 'Notification Settings',
		'/app/esims': 'eSIM Management',
		'/app/orders': 'Purchase History',
	};

	return titles[pathname] || 'Dashboard';
};

export function AppTopBar() {
	const pathname = usePathname();
	const title = getTitleFromPath(pathname);
	const account = useAppSelector((state) => state.account.user.session);

	return (
		<header className={styles.appTopBar}>
			<h1 className="text-lg font-semibold">{title}</h1>

			<div className="flex items-center gap-6 relative">
				<button className="text-gray-600 hover:text-indigo-600">
					<Bell size={20} />
				</button>

				<CartIcon className={styles.cartIcon} />

				<AccountDropdown account={account} />
			</div>
		</header>
	);
}
