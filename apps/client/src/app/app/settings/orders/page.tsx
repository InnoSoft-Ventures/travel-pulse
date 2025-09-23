import React from 'react';
import OrdersClient from './orders-client';

export const metadata = {
	title: 'Orders',
};

export default function OrdersPage() {
	return (
		<div>
			<OrdersClient />
		</div>
	);
}
