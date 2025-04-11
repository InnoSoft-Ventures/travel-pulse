'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Input, Logo } from '@travelpulse/ui';

import MailIcon from '@/assets/mail-icon.svg';
import LockIcon from '@/assets/lock-icon.svg';
import GoogleIcon from '@/assets/google.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './login.module.scss';

export default function LoginPage() {
	return (
		<div className={styles.loginContainer}>
			<div>
				{/* Left Section */}
				<div className={styles.loginForm}>
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
							<Button className={styles.googleBtn}>
								<GoogleIcon />
								Sign in with Google
							</Button>
							<div className={styles.divider}>
								<span>or sign in with</span>
							</div>
							<h2 className={styles.title}>Sign In</h2>
							<p className={styles.subtitle}>
								Enter your details to access your eSIM.
							</p>
							<form action="">
								<Input
									variant="secondary"
									type="email"
									placeholder="Email address"
									icon={<MailIcon />}
									containerClassName={styles.authInput}
								/>
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									containerClassName={styles.authInput}
								/>

								<div className={styles.forgotPassword}>
									Did you forget your password?{' '}
									<Link href="/auth/forgot-password">
										Reset password
									</Link>
								</div>

								<Button className={styles.signInBtn}>
									Sign In
								</Button>
							</form>

							<p className={styles.signupText}>
								Don’t have an account?{' '}
								<Link href="/auth/signup">Sign Up</Link>
							</p>
						</div>
					</div>
					<div className={styles.terms}>
						Privacy policy & Terms of services
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
