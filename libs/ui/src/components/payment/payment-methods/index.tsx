'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { PaymentCard } from '../payment-card';
import { Paypal } from '../paypal';
import { Button, Checkbox, Title } from '../../common';
import Link from 'next/link';

interface PaymentMethodsProps {
	currency: string;
	hasItems: boolean;
	total: number;
}

export const PaymentMethods = ({
	currency,
	hasItems,
	total,
}: PaymentMethodsProps) => {
	const [selectedMethod, setSelectedMethod] = useState<
		'card' | 'paypal' | null
	>(null);
	const [isCardValid, setIsCardValid] = useState(false);
	const [isEsimCompatible, setIsEsimCompatible] = useState(false);
	const [isPayButtonEnabled, setIsPayButtonEnabled] = useState(false);

	useEffect(() => {
		const isPaypalSelected = selectedMethod === 'paypal';
		const isCardSelectedAndValid = selectedMethod === 'card' && isCardValid;

		setIsPayButtonEnabled(
			isEsimCompatible && (isPaypalSelected || isCardSelectedAndValid)
		);
	}, [selectedMethod, isCardValid, isEsimCompatible]);

	return (
		<form>
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
					type="submit"
					disabled={!isPayButtonEnabled || !hasItems}
				>
					Pay {currency}
					{total}
				</Button>
			</div>

			<div className={styles.sslNotice}>
				All transactions are secure and encrypted via SSL encryption
			</div>
		</form>
	);
};
