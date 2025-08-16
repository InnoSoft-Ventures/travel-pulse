'use client';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../dropdown';
import Link from 'next/link';
import { UserProfile } from '../../layout/user-profile';

import styles from './styles.module.scss';
import { UserDataDAO } from '@travelpulse/interfaces';
import { useAppDispatch } from '@travelpulse/state';
import { logoutUser } from '@travelpulse/state/thunks';

interface AccountDropdownProps {
	account: UserDataDAO['user'];
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
	account,
}) => {
	const dispatch = useAppDispatch();

	function onLogoutFn(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		dispatch(logoutUser());
	}

	return (
		<div className="relative">
			<DropdownMenu>
				<DropdownMenuTrigger
					asChild
					className={styles.userProfileTrigger}
				>
					<button type="button">
						<UserProfile
							name={account.firstName}
							avatarUrl={account.picture}
						/>
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
						<Link href="/app/settings/account">Profile</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href="/app/orders">Orders</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a href="/logout" onClick={onLogoutFn}>
							Logout
						</a>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
