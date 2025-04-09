'use client';

import React from 'react';
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
				<Link href="/partner-with-us">Partner with Us</Link>
				<Link href="/about">About Us</Link>
				<Link href="/help">Help Center</Link>
				<Link href="/careers">Careers</Link>
				<Link href="/privacy-policy">Privacy Policy</Link>
			</div>
		</footer>
	);
};

export { Footer };
