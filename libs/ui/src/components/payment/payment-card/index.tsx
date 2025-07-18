import React from 'react';
import CreditCardIcon from '../../../assets/credit-card.svg';

import styles from './style.module.scss';
import { cn } from '../../../utils';
import { Input } from '../../common';

interface PaymentCardProps {
	selected?: boolean;
}

export const PaymentCard = ({ selected = false }: PaymentCardProps) => {
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

					<form className={styles.form}>
						<div className={styles.formGroup}>
							<label htmlFor="cardNumber">Card Number</label>
							<Input
								variant="secondary"
								type="text"
								id="cardNumber"
								placeholder="1234 1234 1234 1234"
								containerClassName={styles.input}
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
								/>
							</div>
						</div>
					</form>
				</>
			)}
		</div>
	);
};
