'use client';
import React, { useMemo } from 'react';
import {
	MinimalNav,
	OrderSummary,
	PaymentMethods,
	Title,
} from '@travelpulse/ui';

import style from './style.module.scss';
import { useAppSelector } from '@travelpulse/ui/state';
import { redirect } from 'next/navigation';

export default function CheckoutClient() {
	const { items: cartItems } = useAppSelector((state) => state.cart);

	// If there are no items in cart redirect to product page
	if (cartItems.list.length === 0) {
		redirect('/destinations/local');
	}

	const calculateTotal = useMemo(() => {
		const subtotal = cartItems.list.reduce((prev, current) => {
			return prev + current.finalPrice * current.quantity;
		}, 0);
		return subtotal;
	}, [cartItems.list]);

	const currency = '£';

	return (
		<div className={style.checkoutContainer}>
			<MinimalNav />
			<main className={style.main}>
				<Title className={style.secureCheckoutTitle} size="size35">
					Secure Checkout
				</Title>

				<div>
					<div className={style.checkoutContent}>
						<div className={style.checkoutLeft}>
							<div className={style.checkoutPaymentDetails}>
								{/* <div>
									<Title size="size16">Create Account</Title>
									<form action=""></form>
								</div> */}

								<PaymentMethods
									currency={currency}
									total={calculateTotal}
								/>
							</div>
						</div>
						<div className={style.checkoutRight}>
							<div className={style.checkoutOrderSummary}>
								<Title
									size="size16"
									className={style.orderDetailsTitle}
								>
									Order details
								</Title>
								<OrderSummary
									currency={currency}
									total={calculateTotal}
									cartItems={cartItems.list}
								/>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
