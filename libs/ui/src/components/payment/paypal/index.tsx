import React from 'react';
import styles from './style.module.scss';

import PaypalIcon from '../../../assets/paypal.svg';

export const Paypal = () => {
	return (
		<div className={styles.paymentCardContainer}>
			<div className={styles.inner}>
				<div>
					<PaypalIcon className={styles.icon} />
				</div>
				<div>
					<div className={styles.cardType}>Paypal</div>
				</div>
			</div>
		</div>
	);
};
