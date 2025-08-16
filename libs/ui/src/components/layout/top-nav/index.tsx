'use client';

import React from 'react';
import styles from './top-nav.module.scss';
import { Button } from '../../common/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../../common/logo';
import { sessionValid, useAppSelector } from '@travelpulse/state';

const TopNav = () => {
	const router = useRouter();

	const isLoggedIn = useAppSelector((state) => sessionValid(state.account));

	const onAuthNavigate = () => {
		router.push(isLoggedIn ? '/app' : '/auth/signin');
	};

	return (
		<div className={styles.topNavContainer}>
			<div>
				<div className="flex justify-between items-center">
					<Logo />
					<div className={styles.navLinks}>
						<div className={styles.links}>
							<Link href="/destinations/local">Destinations</Link>
							<Link href="/about">About Us</Link>
							<Link href="/help">Help & FAQs</Link>
							<Link href="/">USD ($)</Link>
						</div>
						<div>
							<Button size="sm" onClick={onAuthNavigate}>
								{isLoggedIn ? 'Dashboard' : 'Sign In / Sign Up'}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

TopNav.displayName = 'TopNav';

export { TopNav };
