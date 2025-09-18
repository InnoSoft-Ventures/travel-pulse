'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { PaymentCard } from '../payment-card';
import { Paypal } from '../paypal';
import { Button, Checkbox, Title } from '../../common';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { createOrder, createPaymentAttempt } from '@travelpulse/state/thunks';
import PaymentModal from '../payment-modal';
import { PaymentMethod } from '@travelpulse/interfaces';
import { launchPaymentProvider } from './payment-provider-launcher';

interface PaymentMethodsProps {
	currency: string;
	hasItems: boolean;
	total: number;
}

// Enable pay button only if:
// - User has confirmed device is eSIM compatible
// - And either PayPal is selected, or Card is selected and valid
export const PaymentMethods = ({
	currency,
	hasItems,
	total,
}: PaymentMethodsProps) => {
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
		null
	);
	const [isCardValid, setIsCardValid] = useState(false);
	const [isEsimCompatible, setIsEsimCompatible] = useState(false);
	const [isPayButtonEnabled, setIsPayButtonEnabled] = useState(false);

	const { status, error } = useAppSelector(
		(state) => state.account.orders.create
	);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (error) {
			console.log(`Order creation failed:, `, error);
		}
	}, [error]);

	useEffect(() => {
		const isPaypalSelected = selectedMethod === 'paypal';
		const isCardSelectedAndValid = selectedMethod === 'card';

		setIsPayButtonEnabled(
			isEsimCompatible && (isPaypalSelected || isCardSelectedAndValid)
		);
	}, [selectedMethod, isCardValid, isEsimCompatible]);

	const [showProcessingModal, setShowProcessingModal] = useState(false);

	const submitOrder = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const order = await dispatch(createOrder()).unwrap();

			// Open processing modal
			setShowProcessingModal(true);

			// Determine provider + method based on selection
			const provider =
				selectedMethod === 'paypal' ? 'paypal' : 'paystack';

			const paymentAttempt = await dispatch(
				createPaymentAttempt({
					orderId: order.orderId,
					provider: provider,
					method: selectedMethod as PaymentMethod,
					currency: 'ZAR', // adjust per selected currency mapping
				})
			).unwrap();

			launchPaymentProvider(paymentAttempt, dispatch);
		} catch (error) {
			console.error('Failed to create order or payment attempt:', error);
		}
	};

	return (
		<>
			<div>
				<Title size="size16">Payment Option</Title>
				<div className={styles.choosePaymentMethodTxt}>
					You can choose or change the payment method to complete your
					order.
				</div>

				<div className={styles.paymentMethodsContainer}>
					<div
						className={styles.paymentMethod}
						onClick={() => setSelectedMethod('card')}
					>
						<PaymentCard
							selected={selectedMethod === 'card'}
							onValidityChange={setIsCardValid}
						/>
					</div>

					<div
						className={styles.paymentMethod}
						onClick={() => setSelectedMethod('paypal')}
					>
						<Paypal selected={selectedMethod === 'paypal'} />
					</div>
				</div>
			</div>

			<div className={styles.securityInfo}>
				<ul>
					<li className={styles.compatibilityCheck}>
						<span className={styles.checkboxWrapper}>
							<Checkbox
								id="esim-compatibility"
								checked={isEsimCompatible}
								onChange={(e) =>
									setIsEsimCompatible(e.target.checked)
								}
							/>
						</span>{' '}
						Before completing this order, please confirm your device
						is eSIM compatible and network-unlocked.{' '}
						<Link href="/learn-more">Learn More</Link>
					</li>
					<li className={styles.termsNotice}>
						By clicking <span>Pay</span>, you agree to our{' '}
						<Link href="/terms">Terms of Service</Link> and{' '}
						<Link href="/privacy">Privacy Policy</Link>.
					</li>
				</ul>
			</div>

			<div className={styles.payButtonContainer}>
				<Button
					size="lg"
					fullWidth
					id="payment-button"
					type="button"
					isLoading={status === 'loading'}
					disabled={!isPayButtonEnabled || !hasItems}
					onClick={submitOrder}
				>
					Pay {currency}
					{total}
				</Button>
			</div>

			<div className={styles.sslNotice}>
				All transactions are secure and encrypted via SSL encryption
			</div>

			<PaymentModal
				open={showProcessingModal}
				onClose={() => setShowProcessingModal(false)}
			/>
		</>
	);
};
