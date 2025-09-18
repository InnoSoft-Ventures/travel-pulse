import React, { useEffect } from 'react';
import { Modal } from '../../common';
import { useAppSelector } from '@travelpulse/state';
import { LoaderIcon } from '../../common/icon';

interface PaymentModalProps {
	open: boolean;
	onClose: () => void;
}

const PaymentModal = ({ open, onClose }: PaymentModalProps) => {
	const paymentAttempt = useAppSelector(
		(state) => state.account.orders.paymentAttempt
	);
	const { confirmation, confirmationStep } = useAppSelector(
		(state) => state.account.orders
	);

	// Auto close when confirmed
	useEffect(() => {
		if (confirmation.status === 'succeeded') {
			setTimeout(() => onClose(), 1200);
		}
	}, [confirmation.status, onClose]);

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
			<div className="loader mb-4">
				<LoaderIcon size={36} />
			</div>
			{confirmation.status === 'succeeded' && (
				<p className="text-lg font-medium text-green-600">
					Payment confirmed! Finalizing order...
				</p>
			)}
			{confirmationStep === 'processing' && (
				<p className="text-lg font-medium">
					Confirming payment, please wait...
				</p>
			)}
			{confirmationStep !== 'processing' &&
				confirmation.status !== 'succeeded' &&
				confirmation.status !== 'loading' && (
					<>
						<p className="text-lg font-medium">
							Waiting for your payment...
						</p>
						<div className="text-sm text-center mt-2">
							Complete the payment in the Paystack window to
							continue.
						</div>
					</>
				)}
			<div className="text-sm text-center mt-2">
				Please do not close this window.
			</div>
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
