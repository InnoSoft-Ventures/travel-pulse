'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, GoogleAuth, Input, Logo } from '@travelpulse/ui';
import {
	RegisterFormValues,
	RegisterSchema,
	useForm,
} from '@travelpulse/ui/forms';

import MailIcon from '@/assets/mail-icon.svg';
import LockIcon from '@/assets/lock-icon.svg';
import GoogleIcon from '@/assets/google.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './signup.module.scss';

export default function SignupPage() {
	const {
		register,
		formSubmit,
		isLoading,
		formState: { errors },
	} = useForm(RegisterSchema);

	const onHandleSubmit = (data: RegisterFormValues, done: () => void) => {
		console.log(data);

		setTimeout(() => {
			done();
		}, 3000);
	};

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
							<GoogleAuth>Sign up with Google</GoogleAuth>
							<div className={styles.divider}>
								<span>or sign up with</span>
							</div>
							<h2 className={styles.title}>Sign Up</h2>
							<p className={styles.subtitle}>
								Enter your details to access your eSIM.
							</p>
							<form onSubmit={formSubmit(onHandleSubmit)}>
								<Input
									variant="secondary"
									type="text"
									placeholder="First name"
									icon={<MailIcon />}
									error={errors.firstName?.message}
									containerClassName={styles.authInput}
									{...register('firstName')}
								/>
								<Input
									variant="secondary"
									type="text"
									placeholder="Last name"
									icon={<MailIcon />}
									error={errors.lastName?.message}
									containerClassName={styles.authInput}
									{...register('lastName')}
								/>
								<Input
									variant="secondary"
									type="email"
									placeholder="Email address"
									icon={<MailIcon />}
									containerClassName={styles.authInput}
									error={errors.email?.message}
									{...register('email')}
								/>
								<Input
									variant="secondary"
									type="password"
									placeholder="Password"
									icon={<LockIcon />}
									containerClassName={styles.authInput}
									error={errors.password?.message}
									{...register('password')}
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

								<Button
									type="submit"
									loading={isLoading}
									className={styles.signUpBtn}
								>
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
