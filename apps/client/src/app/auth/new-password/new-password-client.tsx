'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Input, Logo } from '@travelpulse/ui';
import { useAppDispatch } from '@travelpulse/ui/state';
import { resetPassword } from '@travelpulse/ui/thunks';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatApiErrorDescription, toast } from '@travelpulse/utils';
import { ErrorHandler } from '@travelpulse/interfaces';

import LockIcon from '@/assets/lock-icon.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './new-password.module.scss';
import { useForm } from '@travelpulse/ui/forms';
import {
	NewPasswordFormValues,
	NewPasswordSchema,
} from '@travelpulse/interfaces/schemas';

export default function NewPasswordClient() {
	const {
		formState: { errors },
		formSubmit,
		register,
		isLoading,
	} = useForm(NewPasswordSchema, {
		mode: 'all',
	});

	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token') || '';
	const tokenMissing = token.length === 0;

	const onSubmit = async (data: NewPasswordFormValues, done: () => void) => {
		if (tokenMissing) {
			toast.error({
				title: 'Reset link invalid',
				description:
					'The password reset link is missing or has expired. Request a new one to continue.',
			});
			done();
			return;
		}

		try {
			await dispatch(
				resetPassword({ token, password: data.password })
			).unwrap();

			toast.success({
				title: 'Password updated',
				description: 'You can now sign in with your new password.',
			});
			router.push('/auth/signin');
		} catch (error) {
			toast.error({
				title: 'Unable to reset password',
				description: formatApiErrorDescription(error as ErrorHandler),
			});
		} finally {
			done();
		}
	};

	return (
		<div className={styles.newPasswordContainer}>
			<div>
				{/* Left Section */}
				<div className={styles.newPasswordForm}>
					<div className={styles.logo}>
						<Logo color="dark" variant="secondary" />
					</div>
					<div className={styles.formContainer}>
						<div className={styles.innerFormContainer}>
							<h2 className={styles.title}>Set New Password</h2>
							<p className={styles.subtitle}>
								Enter your new password to finish resetting your
								credentials.
							</p>
							{tokenMissing ? (
								<p className={styles.tokenWarning}>
									This reset link is invalid or has expired.
									Please request a new one. <br />
									<Link href="/auth/forgot-password">
										Return to forgot password
									</Link>
								</p>
							) : null}
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
									disabled={isLoading || tokenMissing}
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
