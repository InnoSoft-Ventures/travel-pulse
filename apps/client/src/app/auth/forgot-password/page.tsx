'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Input, Logo } from '@/components/ui';

import MailIcon from '@/assets/mail-icon.svg';
import InternetBg from '@/public/assets/internet-img.jpg';

import styles from './forgot-password.module.scss';

export default function ForgotPasswordPage() {
	return (
		<div className={styles.forgotPasswordContainer}>
			<div>
				{/* Left Section */}
				<div className={styles.forgotPasswordForm}>
					<div className={styles.logo}>
						<Logo
							color="dark"
							variant="secondary"
							iconStyle={{
								top: '1px',
							}}
						/>
					</div>
					<div className={styles.formContainer}>
						<div className={styles.innerFormContainer}>
							<h2 className={styles.title}>Forward Password</h2>
							<p className={styles.subtitle}>
								Enter your email address to reset your password.
							</p>
							<form action="">
								<Input
									variant="secondary"
									type="email"
									placeholder="Email address"
									icon={<MailIcon />}
									className={styles.authInput}
								/>

								<Button className={styles.forgotPasswordBtn}>
									Reset Password
								</Button>
							</form>

							<p className={styles.forgotPasswordText}>
								Already have an account?{' '}
								<Link href="/auth/signin">Sign In</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Right Section - Background Image */}
				<div className={styles.heroSection}>
					<div className={styles.heroImage}>
						<Image
							src={InternetBg}
							alt="Hero Image"
							fill
							priority
							sizes="100%"
							style={{ objectFit: 'cover' }}
						/>

						<div className={styles.heroOverlay}>
							<h3>Stay connected wherever you are</h3>
							<p>TravelPulse is your number one game changer.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
