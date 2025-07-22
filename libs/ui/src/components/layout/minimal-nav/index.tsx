import React from 'react';
import { Logo } from '../../logo';
import styles from './styles.module.scss';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../common/dropdown';
import { UserProfile } from '../user-profile';
import Link from 'next/link';
import { BellIcon } from 'lucide-react';

export const MinimalNav = () => {
	// Mock user data - replace with actual user data from context or props
	const user = {
		name: 'Martin Rollins',
		avatarUrl: 'https://randomuser.me/api/portraits/men/19.jpg',
	};

	return (
		<nav className={styles.minimalNav}>
			<div className={styles.inner}>
				<div>
					<Logo color="dark" variant="secondary" />
				</div>
				<div className={styles.right}>
					<div className={styles.currency}>USD ($)</div>
					<div className={styles.notificationIcon}>
						<BellIcon />
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div style={{ cursor: 'pointer' }}>
								<UserProfile {...user} />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Link href="/dashboard">Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/dashboard/account">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/dashboard/orders">Orders</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/logout">Logout</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
};
