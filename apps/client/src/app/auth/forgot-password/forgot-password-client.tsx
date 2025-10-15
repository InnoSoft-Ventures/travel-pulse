'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Input, Logo } from '@travelpulse/ui';
import { useAppDispatch } from '@travelpulse/ui/state';
import { forgotPassword } from '@travelpulse/ui/thunks';
import { formatApiErrorDescription, toast } from '@travelpulse/utils';
import { ErrorHandler } from '@travelpulse/interfaces';

import MailIcon from '@/assets/mail-icon.svg';
import InternetBg from '@/assets/internet-img.jpg';

import styles from './forgot-password.module.scss';
import { useForm } from '@travelpulse/ui/forms';
import { EmailFormValues, EmailSchema } from '@travelpulse/interfaces/schemas';
import { cn } from '@travelpulse/ui/utils';

const DEFAULT_PASSWORD_RESET_COOLDOWN_SECONDS =
	Number.parseInt(
		process.env.NEXT_PUBLIC_PASSWORD_RESET_COOLDOWN_SECONDS || '',
		10
	) || 300;

export default function ForgotPasswordClient() {
	const {
		formState: { errors },
		isLoading,
		formSubmit,
		register,
	} = useForm(EmailSchema);

	const dispatch = useAppDispatch();
	const [emailSent, setEmailSent] = useState(false);
	const [lastRequestedEmail, setLastRequestedEmail] = useState('');
	const [cooldown, setCooldown] = useState(0);

	useEffect(() => {
		if (cooldown <= 0) {
			return;
		}

		const timer = window.setInterval(() => {
			setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [cooldown]);

	const onSubmit = async (data: EmailFormValues, done: () => void) => {
		const normalizedEmail = data.email.trim().toLowerCase();

		try {
			const result = (await dispatch(
				forgotPassword({ email: normalizedEmail })
			).unwrap()) as { sent?: boolean; cooldownSeconds?: number };

			setEmailSent(true);
			setLastRequestedEmail(normalizedEmail);
			setCooldown(
				result?.cooldownSeconds ??
					DEFAULT_PASSWORD_RESET_COOLDOWN_SECONDS
			);

			toast.success({
				title: 'Check your email',
				description:
					'If that address is registered, you will receive instructions to reset your password.',
			});
		} catch (error) {
			toast.error({
				title: 'Request failed',
				description: formatApiErrorDescription(error as ErrorHandler),
			});
		} finally {
			done();
		}
	};

	return (
		<div className={styles.forgotPasswordContainer}>
			<div>
				{/* Left Section */}
				<div className={styles.forgotPasswordForm}>
					<div className={styles.logo}>
						<Logo color="dark" variant="secondary" />
					</div>
					<div className={styles.formContainer}>
						<div className={styles.innerFormContainer}>
							<h2 className={styles.title}>Forward Password</h2>
							<p className={styles.subtitle}>
								Enter your email address to reset your password.
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

								<Button
									type="submit"
									isLoading={isLoading}
									disabled={cooldown > 0}
									className={styles.forgotPasswordBtn}
								>
									Reset Password
								</Button>

								{emailSent ? (
									<p
										className={cn(
											styles.successMessage,
											'mt-5'
										)}
									>
										If an account exists for{' '}
										<span className="font-semibold">
											{lastRequestedEmail}
										</span>
										, you&apos;ll receive a reset link
										shortly.
									</p>
								) : null}
								{cooldown > 0 ? (
									<p className={styles.cooldownMessage}>
										You can request another email in{' '}
										{cooldown} second
										{cooldown === 1 ? '' : 's'}.
									</p>
								) : null}
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
