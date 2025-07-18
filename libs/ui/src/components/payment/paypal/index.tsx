import React from 'react';
import styles from './style.module.scss';

import PaypalIcon from '../../../assets/paypal.svg';

interface PaypalProps {
	selected?: boolean;
}

export const Paypal = ({ selected = false }: PaypalProps) => {
	return (
		<div className={styles.paymentCardContainer} data-selected={selected}>
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
