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
	const cartState = useAppSelector((state) => state.cart);

	// If there are no items in cart redirect to product page
	if (cartState.items.list.length === 0) {
		redirect('/destinations/local');
	}

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
									currency={cartState.details.currency}
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
				</div>
			</main>
		</div>
	);
}
