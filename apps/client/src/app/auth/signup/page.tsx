'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, GoogleAuth, Input, Logo, toast } from '@travelpulse/ui';
import { useForm } from '@travelpulse/ui/forms';

import { registerUser } from '@travelpulse/ui/thunks';

import MailIcon from '@/assets/mail-icon.svg';
import LockIcon from '@/assets/lock-icon.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './signup.module.scss';
import {
	RegisterFormValues,
	RegisterSchema,
} from '@travelpulse/interfaces/schemas';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
	const {
		register,
		formSubmit,
		formState: { errors },
	} = useForm(RegisterSchema);

	const dispatch = useAppDispatch();
	const { status } = useAppSelector((state) => state.auth);

	const router = useRouter();

	const onHandleSubmit = async (data: RegisterFormValues) => {
		try {
			await dispatch(registerUser(data)).unwrap();

			// @TODO - Redirect to verify email page
			// router.push('/auth/verify-email');

			// For now, redirect to the login page
			router.push('/auth/signin');
		} catch (error) {
			toast.error({
				title: 'Registration failed',
				// @ts-ignore
				description: error || 'Please try again later.',
			});
			console.error('Registration failed:', error);
		}
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
									isLoading={status === 'loading'}
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
