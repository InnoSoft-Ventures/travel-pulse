'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
	MinimalNav,
	OrderSummarySkeleton,
	PaymentMethodsSkeleton,
	Title,
} from '@travelpulse/ui';

import style from './style.module.scss';
import { useAppSelector } from '@travelpulse/ui/state';

// Code-split heavier components via subpath exports
const PaymentMethods = dynamic(
	() =>
		import('@travelpulse/ui/payment/payment-methods').then(
			(m) => m.PaymentMethods
		),
	{
		ssr: false,
		loading: () => <PaymentMethodsSkeleton />,
	}
);

const OrderSummary = dynamic(
	() =>
		import('@travelpulse/ui/payment/order-summary').then(
			(m) => m.OrderSummary
		),
	{
		ssr: false,
		loading: () => <OrderSummarySkeleton />,
	}
);

function EmptyCartRedirect() {
	useEffect(() => {
		window.location.replace('/destinations/local');
	}, []);
	return (
		<div className={style.emptyCartNotice}>Redirecting to products...</div>
	);
}

export default function CheckoutClient() {
	const cartState = useAppSelector((state) => state.app.cart);

	if (cartState.items.list.length === 0) {
		return <EmptyCartRedirect />;
	}

	return (
		<div className={style.checkoutContainer}>
			<MinimalNav />
			<main className={style.main}>
				<Title className={style.secureCheckoutTitle} size="size35">
					Secure Checkout
				</Title>

				<div className={style.checkoutContent}>
					<div className={style.checkoutLeft}>
						<div className={style.checkoutPaymentDetails}>
							<PaymentMethods
								currency={cartState.details.currency}
								hasItems={cartState.items.list.length > 0}
								total={cartState.details.total}
							/>
						</div>
					</div>
					<div className={style.checkoutRight}>
						<div className={style.checkoutOrderSummary}>
							<Title
								size="size16"
								className={style.orderDetailsTitle}
							>
								Order details{' '}
								{cartState.items.list.length > 1 && (
									<span
										className={style.itemCount}
										title={`${cartState.items.list.length} packages in cart`}
									>
										({cartState.items.list.length})
									</span>
								)}
							</Title>
							<OrderSummary cartState={cartState} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
