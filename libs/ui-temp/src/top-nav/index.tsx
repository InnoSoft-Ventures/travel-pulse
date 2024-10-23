import React from 'react';
import Logo from '@/assets/logo.svg';
import styles from './top-nav.module.scss';
import { Button } from '../button';
import Link from 'next/link';

const TopNav = () => {
	return (
		<div className={styles.topNavContainer}>
			<div>
				<div className="flex justify-between items-center">
					<div className="flex items-center h-full">
						<div className={styles.logoIcon}>
							<Logo />
						</div>
						<div className={styles.logoName}>TravelPulse -</div>
						<div className={styles.logoSlogan}>
							Your eSIM Connection Hub
						</div>
					</div>
					<div className={styles.navLinks}>
						<div className={styles.links}>
							<Link href="/">Destinations</Link>
							<Link href="/">About Us</Link>
							<Link href="/">Help & FAQs</Link>
							<Link href="/">USD ($)</Link>
						</div>
						<div>
							<Button size="sm">Sign In / Sign Up</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

TopNav.displayName = 'TopNav';

export { TopNav };
