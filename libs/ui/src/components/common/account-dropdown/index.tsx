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
		dispatch(logoutUser({ redirectToLoginPage: true }));
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
							firstName={account.firstName}
							lastName={account.lastName}
							avatarUrl={account.picture}
						/>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className={styles.dropdownMenuContent}
					align="end"
				>
					<DropdownMenuItem className="p-0">
						<Link href="/app" className="px-2 py-1.5 flex-1">
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0">
						<Link
							href="/app/settings/account"
							className="px-2 py-1.5 flex-1"
						>
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0">
						<Link
							href="/app/settings/orders"
							className="px-2 py-1.5 flex-1"
						>
							Orders
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0">
						<a
							href="/logout"
							className="px-2 py-1.5 flex-1"
							onClick={onLogoutFn}
						>
							Logout
						</a>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
