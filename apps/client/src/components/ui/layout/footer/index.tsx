'use client';

import Link from 'next/link';
import styles from './footer.module.scss';
import { Logo } from '../../logo';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.left}>
				<div className={styles.logo}>
					<Logo
						iconStyle={{
							top: '-7px',
						}}
					/>
				</div>
				<p className={styles.copyright}>
					© {new Date().getFullYear()} TravelPulse. All Rights
					Reserved.
				</p>
			</div>

			<div className={styles.right}>
				<Link href="/">Partner with Us</Link>
				<Link href="/">About Us</Link>
				<Link href="/">Help Center</Link>
				<Link href="/">Careers</Link>
				<Link href="/">Privacy Policy</Link>
			</div>
		</footer>
	);
};

export { Footer };
