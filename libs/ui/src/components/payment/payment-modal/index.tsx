import React from 'react';
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
			<p className="text-lg font-medium">
				Payment attempt created successfully.
			</p>
		</div>
	);

	const Description = () => {
		switch (paymentAttempt.status) {
			case 'loading':
				return <Preparing />;
			case 'failed':
				return <Failed />;
			case 'succeeded':
				// return <Preparing />;
				return <PaymentAttemptCreatedSuccessfully />;
			default:
				return null;
		}
	};

	return (
		<Modal
			open={true || open}
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
