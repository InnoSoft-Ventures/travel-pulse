'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, GoogleAuth, Input, Logo } from '@travelpulse/ui';

import MailIcon from '@/assets/mail-icon.svg';
import LockIcon from '@/assets/lock-icon.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './login.module.scss';
import { LoginFormValues, LoginSchema, useForm } from '@travelpulse/ui/forms';

export default function LoginPage() {
	const {
		formSubmit,
		register,
		isLoading,
		formState: { errors },
	} = useForm(LoginSchema, {
		mode: 'all',
	});

	const onSubmit = async (data: LoginFormValues, done: () => void) => {
		console.log('Form submitted:', data);

		setTimeout(() => {
			done();
		}, 3000);
	};

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
							<GoogleAuth>Sign in with Google</GoogleAuth>
							<div className={styles.divider}>
								<span>or sign in with</span>
							</div>
							<h2 className={styles.title}>Sign In</h2>
							<p className={styles.subtitle}>
								Enter your details to access your eSIM.
							</p>
							<form onSubmit={formSubmit(onSubmit)}>
								<Input
									variant="secondary"
									type="email"
									placeholder="Email address"
									icon={<MailIcon />}
									containerClassName={styles.authInput}
									{...register('email')}
									error={errors.email?.message}
								/>
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									containerClassName={styles.authInput}
									{...register('password')}
									error={errors.password?.message}
								/>

								<div className={styles.forgotPassword}>
									Did you forget your password?{' '}
									<Link href="/auth/forgot-password">
										Reset password
									</Link>
								</div>

								<Button
									type="submit"
									loading={isLoading}
									className={styles.signInBtn}
								>
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
