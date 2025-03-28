'use client';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import LockIcon from '@/assets/lock-icon.svg';
import InternetBg from '@/public/assets/internet-img.jpg';

import styles from './login.module.scss';
import Logo from '@/components/ui/logo';

export default function NewPasswordPage() {
	return (
		<div className={styles.newPasswordContainer}>
			<div>
				{/* Left Section */}
				<div className={styles.newPasswordForm}>
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
							<h2 className={styles.title}>Set New Password</h2>
							<p className={styles.subtitle}>
								Enter your new password.
							</p>
							<form action="">
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									className={styles.authInput}
								/>
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									className={styles.authInput}
								/>

								<Button className={styles.signInBtn}>
									Reset Password
								</Button>
							</form>
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
