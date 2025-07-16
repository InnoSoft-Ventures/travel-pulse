import React from 'react';
import { MinimalNav } from '@travelpulse/ui';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
	return {
		title: 'Checkout',
	};
}

export default function CheckoutPage() {
	return (
		<div>
			<MinimalNav />
		</div>
	);
}
