import React, { useEffect, useState } from 'react';
import { Modal } from '../../common';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { LoaderIcon } from '../../common/icon';
import { listenPaymentConfirmed } from '../payment-methods/payment-sse';
import { updateConfirmationStep } from '@travelpulse/state';
import { CheckCircle } from 'lucide-react';
import { PaymentCardPayload } from '@travelpulse/interfaces';

interface PaymentModalProps {
	open: boolean;
	selectedCard: Pick<PaymentCardPayload, 'id' | 'last4'> | null;
	onClose: (redirect?: boolean, orderId?: number) => void;
}

const PaymentModal = ({ open, onClose, selectedCard }: PaymentModalProps) => {
	const dispatch = useAppDispatch();
	const { confirmation, confirmationStep, paymentAttempt } = useAppSelector(
		(state) => state.account.orders
	);

	const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

	// Auto close and countdown
	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let intervalId: ReturnType<typeof setInterval> | null = null;

		const setupClose = (ms: number) => {
			setSecondsLeft(Math.ceil(ms / 1000));

			intervalId = setInterval(() => {
				setSecondsLeft((s) => {
					const timeLeft = s !== null ? Math.max(s - 1, 0) : s;
					const left = timeLeft !== null ? timeLeft : 0;

					if (left <= 0 && intervalId) {
						clearInterval(intervalId);
					}

					console.log(left);
					return left;
				});
			}, 1000);

			timeoutId = setTimeout(() => {
				const orderId = paymentAttempt.data?.orderId;

				onClose(!!orderId, orderId);
			}, ms);
		};

		if (confirmationStep === 'completed') {
			setupClose(30000);
		} else if (
			confirmation.status === 'succeeded' ||
			confirmationStep === 'failed' ||
			confirmationStep === 'closed' ||
			paymentAttempt.status === 'failed'
		) {
			const ms =
				confirmationStep === 'failed' ||
				paymentAttempt.status === 'failed'
					? 2500
					: 1200;
			setupClose(ms);
		} else {
			setSecondsLeft(null);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
		};
	}, [confirmation.status, paymentAttempt, confirmationStep, onClose]);

	const Preparing = () => (
		<div className="flex flex-col items-center justify-center p-6">
			<div className="loader mb-4">
				<LoaderIcon size={36} />
			</div>
			<p className="text-lg font-medium">
				Preparing your payment, please wait...
			</p>
		</div>
	);

	const Failed = () => (
		<div className="flex flex-col items-center justify-center p-6">
			<p className="text-lg font-medium">
				Payment attempt failed. Please try again.
			</p>
		</div>
	);

	const PaymentAttemptCreatedSuccessfully = () => (
		<div className="flex flex-col items-center justify-center p-6">
			{confirmationStep !== 'completed' && (
				<div className="loader mb-4">
					<LoaderIcon size={36} />
				</div>
			)}
			{confirmationStep === 'completed' && (
				<div className="flex flex-col items-center">
					<CheckCircle size={40} className="text-green-600 mb-2" />
					<p className="text-lg font-medium text-green-600">
						Payment confirmed! You're all set.
					</p>
					{typeof secondsLeft === 'number' && (
						<p className="text-sm text-gray-500 mt-1">
							Closing in {secondsLeft}s
						</p>
					)}
				</div>
			)}
			{confirmation.status === 'succeeded' &&
				confirmationStep !== 'completed' && (
					<p className="text-lg font-medium text-green-600">
						Payment confirmed! Finalizing order...
					</p>
				)}
			{confirmationStep === 'processing' && (
				<p className="text-lg font-medium">
					Confirming payment, please wait...
				</p>
			)}

			{confirmationStep === 'failed' && (
				<p className="text-lg font-medium text-red-600">
					Payment confirmation timed out.
				</p>
			)}
			{confirmationStep !== 'processing' &&
				confirmationStep !== 'completed' &&
				confirmation.status !== 'succeeded' &&
				confirmation.status !== 'loading' && (
					<>
						<p className="text-lg font-medium">
							Waiting for your payment...
						</p>
						{!selectedCard ? (
							<div className="text-sm text-center mt-2">
								Complete the payment in the Paystack window to
								continue.
							</div>
						) : (
							<div className="text-sm text-center mt-2">
								Please wait, charging card ending with ••••
								<strong>{selectedCard.last4}</strong>.
							</div>
						)}
					</>
				)}

			{confirmationStep !== 'completed' && (
				<div className="text-sm text-center mt-2">
					Please do not close this window.
				</div>
			)}
		</div>
	);

	const Description = () => {
		switch (paymentAttempt.status) {
			case 'loading':
				return <Preparing />;
			case 'failed':
				return <Failed />;
			case 'succeeded':
				return <PaymentAttemptCreatedSuccessfully />;
			default:
				return null;
		}
	};

	// Listen for SSE confirmation and trigger confirm thunk once
	useEffect(() => {
		if (!open) return;
		if (paymentAttempt.status !== 'succeeded' || !paymentAttempt.data)
			return;

		const stop = listenPaymentConfirmed((evt) => {
			const { orderId, paymentId } = paymentAttempt.data!;
			console.log(
				'Payment confirmed event received:',
				evt.orderId === orderId && evt.paymentId === paymentId,
				evt
			);

			if (evt.orderId === orderId && evt.paymentId === paymentId) {
				dispatch(updateConfirmationStep('completed'));
			}
		});
		return () => {
			stop();
			// If user closes modal before confirmation completes
			if (confirmation.status !== 'succeeded') {
				dispatch(updateConfirmationStep('closed'));
			}
		};
	}, [open, paymentAttempt.status]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			showCloseIcon={false}
			description={<Description />}
			showFooter={false}
			closeOnEsc={false}
			closeOnOverlayClick={false}
		/>
	);
};

export default PaymentModal;
