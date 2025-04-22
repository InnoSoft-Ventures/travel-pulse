'use client';
import Image from 'next/image';
import { Button, Input, Logo } from '@travelpulse/ui';

import LockIcon from '@/assets/lock-icon.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './new-password.module.scss';
import { useForm } from '@travelpulse/ui/forms';
import {
	NewPasswordFormValues,
	NewPasswordSchema,
} from '@travelpulse/interfaces/schemas';

export default function NewPasswordPage() {
	const {
		formState: { errors },
		formSubmit,
		register,
		isLoading,
	} = useForm(NewPasswordSchema, {
		mode: 'all',
	});

	const onSubmit = (data: NewPasswordFormValues, done: () => void) => {
		console.log('New password', data);

		setTimeout(() => {
			done();
		}, 3000);
	};

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
							<form onSubmit={formSubmit(onSubmit)}>
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									containerClassName={styles.authInput}
									{...register('password')}
									error={errors.password?.message}
								/>
								<Input
									variant="secondary"
									type="password"
									placeholder="Confirm Password"
									icon={<LockIcon />}
									containerClassName={styles.authInput}
									{...register('confirmPassword')}
									error={errors.confirmPassword?.message}
								/>

								<Button
									className={styles.signInBtn}
									type="submit"
									isLoading={isLoading}
								>
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
