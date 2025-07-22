import React, { useEffect, useState } from 'react';
import CreditCardIcon from '../../../assets/credit-card.svg';

import styles from './style.module.scss';
import { cn } from '../../../utils';
import { Input } from '../../common';

interface PaymentCardProps {
	selected?: boolean;
	onValidityChange: (isValid: boolean) => void;
}

export const PaymentCard = ({
	selected = false,
	onValidityChange,
}: PaymentCardProps) => {
	const [cardNumber, setCardNumber] = useState('');
	const [name, setName] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [cvv, setCvv] = useState('');

	useEffect(() => {
		if (selected) {
			const isCardNumberValid =
				cardNumber.replace(/\s/g, '').length >= 12;
			const isNameValid = name.trim().length > 0;
			const isExpiryDateValid = /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(
				expiryDate
			);
			const isCvvValid = /^\d{3,4}$/.test(cvv);

			console.log({
				isCardNumberValid,
				isNameValid,
				isExpiryDateValid,
				isCvvValid,
			});

			onValidityChange(
				isCardNumberValid &&
					isNameValid &&
					isExpiryDateValid &&
					isCvvValid
			);
		}
	}, [cardNumber, name, expiryDate, cvv, selected, onValidityChange]);

	return (
		<div className={styles.paymentCardContainer} data-selected={selected}>
			<div className={styles.inner}>
				<div>
					<CreditCardIcon />
				</div>
				<div>
					<div className={styles.cardType}>Credit / Debit Card</div>
					<div className={styles.cardTypeList}>
						Pay securely using your Mastercard, Visa, AMEX, Maestro,
						Discover, or American Express.
					</div>
				</div>
			</div>

			{selected && (
				<>
					<hr className={styles.divider} />

					<div className={styles.form}>
						<div className={styles.formGroup}>
							<label htmlFor="cardNumber">Card Number</label>
							<Input
								variant="secondary"
								type="text"
								id="cardNumber"
								placeholder="1234 1234 1234 1234"
								containerClassName={styles.input}
								value={cardNumber}
								onChange={(e) => setCardNumber(e.target.value)}
							/>
						</div>
						<div className={styles.row}>
							<div className={styles.formGroup}>
								<label htmlFor="name">Name on card</label>
								<Input
									variant="secondary"
									type="text"
									id="name"
									placeholder="Card name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div
								className={cn(
									styles.formGroup,
									styles.halfWidth
								)}
							>
								<label htmlFor="expiryDate">Expire date</label>
								<Input
									variant="secondary"
									type="text"
									id="expiryDate"
									placeholder="MM / YY"
									value={expiryDate}
									onChange={(e) =>
										setExpiryDate(e.target.value)
									}
								/>
							</div>
							<div
								className={cn(
									styles.formGroup,
									styles.halfWidth
								)}
							>
								<label htmlFor="cvv">CVV</label>
								<Input
									variant="secondary"
									type="text"
									id="cvv"
									placeholder="CVV"
									value={cvv}
									onChange={(e) => setCvv(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
