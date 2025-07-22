import React from 'react';
import { Metadata } from 'next';

import CheckoutClient from './checkout-client';

export function generateMetadata(): Metadata {
	return {
		title: 'Checkout',
	};
}

export default function CheckoutPage() {
	return <CheckoutClient />;
}
