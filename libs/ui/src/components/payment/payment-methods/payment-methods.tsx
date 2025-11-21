'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { PaymentCard } from '../payment-card';
// import { Paypal } from '../paypal';
import { Button, Checkbox, Title } from '../../common';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import {
	chargePaymentCardThunk,
	createOrder,
	createPaymentAttempt,
	reInitiatePaymentAttempt,
} from '@travelpulse/state/thunks';
import PaymentModal from '../payment-modal';
import {
	OrderStatus,
	PaymentCardPayload,
	PaymentMethod,
} from '@travelpulse/interfaces';
import { launchPaymentProvider } from './payment-provider-launcher';
import { cn } from '../../../utils';

interface PaymentMethodsProps {
	currency?: string;
	hasItems: boolean;
	total: number | string;
	orderId?: number;
	onCancel?: () => void;
	orderStatus?: OrderStatus;
}

// Enable pay button only if:
// - User has confirmed device is eSIM compatible
// - And either PayPal is selected, or Card is selected and valid
export const PaymentMethods = ({
	currency,
	hasItems,
	total,
	onCancel,
	orderId,
	orderStatus,
}: PaymentMethodsProps) => {
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
		'card'
	);
	const [selectedCard, setSelectedCard] = useState<Pick<
		PaymentCardPayload,
		'id' | 'last4'
	> | null>(null);
	const [showProcessingModal, setShowProcessingModal] = useState(false);

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
	}, [selectedMethod, isEsimCompatible]);

	async function processPaymentAttempt(orderId: number) {
		const existingOrder = !!orderId;
		// Determine provider + method based on selection
		const provider = selectedMethod === 'paypal' ? 'paypal' : 'paystack';

		// Trigger payment processing for existing order if status = PROCESSING_PAYMENT
		if (orderStatus === OrderStatus.PROCESSING_PAYMENT && existingOrder) {
			// Fetch existing payment attempt for order
			return await dispatch(
				reInitiatePaymentAttempt({
					orderId,
				})
			).unwrap();
		}

		return await dispatch(
			createPaymentAttempt({
				orderId,
				provider: provider,
				method: selectedMethod as PaymentMethod,
				currency: 'ZAR', // adjust per selected currency mapping
			})
		).unwrap();
	}

	const processPayment = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			let currentOrderId = orderId;

			// If no orderId provided, create a new order first
			if (!currentOrderId) {
				const order = await dispatch(createOrder()).unwrap();
				currentOrderId = order.orderId;
			}

			// Open processing modal
			setShowProcessingModal(true);

			// If existing order and its status = PROCESSING_PAYMENT, re-initiate payment attempt
			// otherwise, create new payment attempt
			const paymentAttempt = await processPaymentAttempt(currentOrderId);

			// Check if paying with saved card or new card
			if (selectedCard) {
				setShowProcessingModal(true);

				const chargeResponse = await dispatch(
					chargePaymentCardThunk({
						paymentAttemptId: paymentAttempt.paymentId,
						orderId: currentOrderId,
						paymentCardId: selectedCard.id,
					})
				).unwrap();

				console.log('Charge response', chargeResponse);

				return;
			}

			launchPaymentProvider(paymentAttempt, dispatch);
		} catch (error) {
			console.error('Failed to create order or payment attempt:', error);
		}
	};

	function handleClose(redirect?: boolean, orderId?: number) {
		if (redirect) {
			try {
				sessionStorage.setItem('tp:clearCartOnOrders', '1');
			} catch {}
			window.location.replace(`/app/settings/orders/${orderId}`);
			return;
		}

		setShowProcessingModal(false);
	}

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
							onSelectedCard={setSelectedCard}
							selectedCard={selectedCard}
							selected={selectedMethod === 'card'}
						/>
					</div>

					{/* <div
						className={styles.paymentMethod}
						onClick={() => setSelectedMethod('paypal')}
					>
						<Paypal selected={selectedMethod === 'paypal'} />
					</div> */}
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

			<div
				className={cn(
					styles.payButtonContainer,
					onCancel ? styles.evenSpacing : ''
				)}
			>
				{onCancel && (
					<Button size="lg" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				)}

				<Button
					size="lg"
					fullWidth={!onCancel}
					id="payment-button"
					type="button"
					isLoading={status === 'loading'}
					disabled={!isPayButtonEnabled || !hasItems}
					onClick={processPayment}
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
				selectedCard={selectedCard}
				onClose={handleClose}
			/>
		</>
	);
};
