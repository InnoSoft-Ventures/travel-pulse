'use client';
import React from 'react';
// import { Bell } from 'lucide-react';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';
import { AccountDropdown } from '../../common';
import { useAppSelector } from '@travelpulse/state';
import { CartIcon } from '../../common/icon';

const getTitleFromPath = (pathname: string, userFullName: string): string => {
	if (pathname.includes('/app/orders/')) {
		return 'Order Details';
	}

	const titles: { [key: string]: string } = {
		'/app/settings/account': 'Account Settings',
		'/app/settings/security': 'Security Settings',
		// '/app/settings/notifications': 'Notification Settings',
		'/app/settings/orders': 'Order History',
		'/app/esims': 'eSIM Management',
		'/app': `Welcome back, ${userFullName}`,
	};

	// Implement partial matching for paths like /app/esims/[esimId]
	for (const path in titles) {
		if (pathname.startsWith(path)) {
			return titles[path];
		}
	}

	return titles[pathname] || 'Dashboard';
};

export function AppTopBar() {
	const pathname = usePathname();
	const account = useAppSelector((state) => state.account.user.session.data);
	const title = getTitleFromPath(
		pathname,
		`${account.firstName} ${account.lastName}`
	);

	return (
		<header className={styles.appTopBar}>
			<h1 className="text-lg font-semibold">{title}</h1>

			<div className="flex items-center gap-6 relative">
				{/* <button className="text-gray-600 hover:text-indigo-600">
					<Bell size={20} />
				</button> */}

				<CartIcon className={styles.cartIcon} />

				<AccountDropdown account={account} />
			</div>
		</header>
	);
}
