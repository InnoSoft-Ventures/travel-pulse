'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import MailIcon from '@/assets/mail-icon.svg';
import LockIcon from '@/assets/lock-icon.svg';
import GoogleIcon from '@/assets/google.svg';
import InternetBg from '@/public/assets/internet-img.jpg';

import styles from './signup.module.scss';
import Logo from '@/components/ui/logo';

export default function SignupPage() {
	return (
		<div className={styles.signupContainer}>
			<div>
				{/* Left Section */}
				<div className={styles.signupForm}>
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
								Sign up with Google
							</Button>
							<div className={styles.divider}>
								<span>or sign up with</span>
							</div>
							<h2 className={styles.title}>Sign Up</h2>
							<p className={styles.subtitle}>
								Enter your details to access your eSIM.
							</p>
							<form action="">
								<Input
									variant="secondary"
									type="text"
									placeholder="Full name"
									icon={<MailIcon />}
									className={styles.authInput}
								/>
								<Input
									variant="secondary"
									type="email"
									placeholder="Email address"
									icon={<MailIcon />}
									className={styles.authInput}
								/>
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									className={styles.authInput}
								/>

								<div className={styles.forgotPassword}>
									By signing up, you agree to the{' '}
									<Link href="/ts/terms-of-service">
										Terms of Service
									</Link>{' '}
									and{' '}
									<Link href="/ts/privacy-policy">
										Privacy Policy
									</Link>
								</div>

								<Button className={styles.signUpBtn}>
									Sign Up
								</Button>
							</form>

							<p className={styles.signInText}>
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
