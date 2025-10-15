'use client';

import Link from 'next/link';
import { Button, Logo } from '@travelpulse/ui';

import styles from '../verify-email.module.scss';

const CheckIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M5 13l4 4L19 7"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default function VerifyEmailSuccessClient() {
	return (
		<div className={styles.verifyEmailContainer}>
			<div className={styles.card}>
				<div className={styles.logo}>
					<Logo color="dark" variant="secondary" />
				</div>

				<div className={`${styles.icon} ${styles.iconSuccess}`}>
					<CheckIcon />
				</div>

				<h1 className={styles.title}>Account verified</h1>
				<p className={styles.subtitle}>
					Your email is confirmed and your TravelPulse account is now
					active. Sign in to start exploring eSIM plans tailored for
					your next trip.
				</p>

				<div className={styles.actions}>
					<Button as={Link} href="/auth/signin">
						Go to sign in
					</Button>
					<p className={styles.secondaryAction}>
						Need to create another account?{' '}
						<Link href="/auth/signup">Sign up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
