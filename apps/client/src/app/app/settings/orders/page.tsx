import React from 'react';
import OrdersClient from './orders-client';
import styles from './styles.module.scss';

export const metadata = {
	title: 'Orders',
};

export default function OrdersPage() {
	return (
		<div className={styles.ordersPageContainer}>
			<OrdersClient />
		</div>
	);
}
