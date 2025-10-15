'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Logo } from '@travelpulse/ui';
import { ApiService, useAppSelector } from '@travelpulse/ui/state';
import { formatApiErrorDescription, toast } from '@travelpulse/utils';

import MailIcon from '@/assets/mail-icon.svg';

import styles from './verify-email.module.scss';

const DEFAULT_COOLDOWN_SECONDS =
	Number.parseInt(
		process.env.NEXT_PUBLIC_ACTIVATION_RESEND_COOLDOWN_SECONDS || '',
		10
	) || 60;

export default function VerifyEmailClient() {
	const [cooldown, setCooldown] = useState(0);
	const [isSending, setIsSending] = useState(false);

	const accountEmail = useAppSelector(
		(state) => state.account.user.session.data.email
	);

	const normalizedEmail = useMemo(
		() => accountEmail?.trim().toLowerCase() ?? '',
		[accountEmail]
	);

	useEffect(() => {
		if (cooldown <= 0) {
			return;
		}

		const timer = window.setInterval(() => {
			setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [cooldown]);

	const handleResend = async () => {
		if (!normalizedEmail) {
			toast.error({
				title: 'Email unavailable',
				description:
					'We could not determine which account to verify. Please sign in again and try resending.',
			});
			return;
		}

		try {
			setIsSending(true);

			const response = await ApiService.post(
				'/auth/resend-verification',
				{
					email: normalizedEmail,
				}
			);
			const payload = response.data as {
				success: boolean;
				message?: string;
				data?: { sent: boolean; alreadyActivated?: boolean };
			};

			if (payload.success && payload.data?.sent) {
				toast.success({
					title: 'Verification email sent',
					description:
						'Check your inbox for the new verification link.',
				});
				const cooldownSeconds = DEFAULT_COOLDOWN_SECONDS;

				setCooldown(cooldownSeconds);
				return;
			}

			if (payload.success && payload.data?.alreadyActivated) {
				toast.success({
					title: 'Account already verified',
					description:
						'You can head to sign in whenever you are ready.',
				});

				const cooldownSeconds = DEFAULT_COOLDOWN_SECONDS;

				setCooldown(cooldownSeconds);
				return;
			}

			toast.success({
				title: 'Request received',
				description:
					"If the email is registered, you'll receive another verification link soon.",
			});

			const fallbackCooldown = DEFAULT_COOLDOWN_SECONDS;

			setCooldown(fallbackCooldown);
		} catch (error: any) {
			const retryAfterSecondsRaw = error?.errors?.retryAfterSeconds;
			const retryAfterSeconds = Number(retryAfterSecondsRaw);

			if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
				setCooldown(retryAfterSeconds);
			}

			toast.error({
				title: 'Could not resend email',
				description: formatApiErrorDescription(error),
			});
		} finally {
			setIsSending(false);
		}
	};

	const resendLabel =
		cooldown > 0
			? `Resend verification email (${cooldown}s)`
			: 'Resend verification email';

	return (
		<div className={styles.verifyEmailContainer}>
			<div className={styles.card}>
				<div className={styles.logo}>
					<Logo color="dark" variant="secondary" />
				</div>

				<div className={styles.icon}>
					<MailIcon aria-hidden="true" className={styles.iconSvg} />
				</div>

				<h1 className={styles.title}>Check your email</h1>
				<p className={styles.subtitle}>
					We just sent a verification link to your inbox. Open it to
					activate your TravelPulse account and unlock all features.
				</p>

				{normalizedEmail ? (
					<p className={styles.emailTarget}>
						Sent to <strong>{normalizedEmail}</strong>
					</p>
				) : null}

				<p className={styles.hint}>
					Didn&apos;t see it yet? Give it a minute and check your spam
					folder.
				</p>

				<div className={styles.actions}>
					<Button
						onPress={handleResend}
						isLoading={isSending}
						disabled={cooldown > 0 || !normalizedEmail}
						className={styles.fullWidthButton}
					>
						{resendLabel}
					</Button>
					{cooldown > 0 ? (
						<p className={styles.cooldownText}>
							You can request another email in {cooldown} second
							{cooldown === 1 ? '' : 's'}.
						</p>
					) : null}
					<Button
						as={Link}
						href="/auth/signin"
						variant="secondary"
						className={styles.fullWidthButton}
					>
						Return to sign in
					</Button>
					<p className={styles.secondaryAction}>
						Need help?{' '}
						<a href="mailto:support@travelpulse.com">Contact us</a>
					</p>
				</div>
			</div>
		</div>
	);
}
