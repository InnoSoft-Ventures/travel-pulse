'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Modal } from '../../common';
import { PaymentMethodsSkeleton } from '../payment-methods';

import styles from './styles.module.scss';
import { OrderStatus } from '@travelpulse/interfaces';

const PaymentMethods = dynamic(
	() => import('../payment-methods').then((m) => m.PaymentMethods),
	{
		ssr: false,
		loading: () => <PaymentMethodsSkeleton />,
	}
);

interface PayNowModalProps {
	total: number;
	currency: string;
	orderId: number;
	orderStatus: OrderStatus;
}

export const PayNowModal = ({
	total,
	currency,
	orderId,
	orderStatus,
}: PayNowModalProps) => {
	const [isOpen, setIsOpen] = useState(false);

	function startPayNow() {
		setIsOpen(true);
	}

	return (
		<>
			<Button size="sm" onClick={startPayNow} disabled={isOpen}>
				Pay now
			</Button>
			<Modal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				showCloseIcon={false}
				closeOnOverlayClick={false}
				showFooter={false}
				closeOnEsc={false}
				className={styles.payNowModal}
			>
				<PaymentMethods
					currency={''}
					hasItems={true}
					onCancel={() => setIsOpen(false)}
					total={`${total} ${currency}`}
					orderId={orderId}
					orderStatus={orderStatus}
				/>
			</Modal>
		</>
	);
};
