'use client';
import React from 'react';
import { Logo } from '../../common/logo';
import styles from './styles.module.scss';
import { BellIcon } from 'lucide-react';
import { sessionValid, useAppSelector } from '@travelpulse/state';
import { AccountDropdown, Button } from '../../common';
import { usePathname, useRouter } from 'next/navigation';

export const MinimalNav = () => {
	const account = useAppSelector((state) => state.account.user.session.data);
	const isLoggedIn = useAppSelector((state) => sessionValid(state.account));
	const router = useRouter();

	// Get the current pathname
	const pathname = usePathname();

	const onAuthNavigate = () => {
		router.push(`/auth/signin?redirect=${pathname}`);
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

					{isLoggedIn ? (
						<>
							<AccountDropdown account={account} />
						</>
					) : (
						<Button size="sm" onClick={onAuthNavigate}>
							Sign In / Sign Up
						</Button>
					)}
				</div>
			</div>
		</nav>
	);
};
