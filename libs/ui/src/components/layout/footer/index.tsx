'use client';

import React from 'react';
import Link from 'next/link';
import styles from './footer.module.scss';
import { Logo } from '../../common/logo';
import { useTheme } from '../../../theme-context';
import { cn } from '../../../utils';

const Footer = () => {
	const { theme } = useTheme();

	return (
		<footer className={cn(styles.footer, styles[theme.footer])}>
			<div className={styles.left}>
				<div className={styles.logo}>
					<Logo
						iconStyle={{
							top: theme.footer === 'dark' ? '-7px' : '0',
						}}
						color={theme.footer === 'dark' ? 'light' : 'dark'}
						variant={
							theme.footer === 'dark' ? 'primary' : 'secondary'
						}
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
