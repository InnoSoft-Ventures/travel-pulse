import React from 'react';
import CreditCardIcon from '../../../assets/credit-card.svg';

import styles from './style.module.scss';

export const PaymentCard = () => {
	return (
		<div className={styles.paymentCardContainer}>
			<div className={styles.inner}>
				<div>
					<CreditCardIcon />
				</div>
				<div>
					<div className={styles.cardType}>Credit / Debit Card</div>
					<div className={styles.cardTypeList}>
						Mastercard, Visa, AMEX, etc.
					</div>
				</div>
			</div>
		</div>
	);
};
