'use client';

import styles from './top-nav.module.scss';
import { Button } from '../button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../logo';

const TopNav = () => {
	const router = useRouter();

	const onAuthNavigate = () => {
		router.push('/auth/signin');
	};

	return (
		<div className={styles.topNavContainer}>
			<div>
				<div className="flex justify-between items-center">
					<Logo />
					<div className={styles.navLinks}>
						<div className={styles.links}>
							<Link href="/destinations/local">Destinations</Link>
							<Link href="/">About Us</Link>
							<Link href="/">Help & FAQs</Link>
							<Link href="/">USD ($)</Link>
						</div>
						<div>
							<Button size="sm" onClick={onAuthNavigate}>
								Sign In / Sign Up
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
