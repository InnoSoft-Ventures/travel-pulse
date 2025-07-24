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

export function AppTopBar() {
	const user = {
		name: 'Martin Rollins',
		avatarUrl: 'https://randomuser.me/api/portraits/men/19.jpg',
	};

	return (
		<header className={styles.appTopBar}>
			<h1 className="text-lg font-semibold">Welcome back, Martin</h1>

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
		</header>
	);
}
