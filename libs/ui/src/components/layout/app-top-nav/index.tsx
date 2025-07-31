'use client';
import React from 'react';
import { Bell } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../common';
import Link from 'next/link';
import { UserProfile } from '../user-profile';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';

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

	const user = {
		name: 'Martin Rollins',
		avatarUrl: 'https://randomuser.me/api/portraits/men/19.jpg',
	};

	return (
		<header className={styles.appTopBar}>
			<h1 className="text-lg font-semibold">{title}</h1>

			<div className="flex items-center gap-6 relative">
				<button className="text-gray-600 hover:text-indigo-600">
					<Bell size={20} />
				</button>

				<div className="relative">
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							className={styles.userProfileTrigger}
						>
							<button type="button">
								<UserProfile {...user} />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className={styles.dropdownMenuContent}
							align="end"
						>
							<DropdownMenuItem>
								<Link href="/app">Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/app/settings/account">
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/app/orders">Orders</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/logout">Logout</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
