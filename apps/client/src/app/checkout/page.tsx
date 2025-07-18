import React from 'react';
import {
	MinimalNav,
	OrderSummary,
	PaymentMethods,
	Title,
} from '@travelpulse/ui';
import { Metadata } from 'next';

import style from './style.module.scss';

export function generateMetadata(): Metadata {
	return {
		title: 'Checkout',
	};
}

export default function CheckoutPage() {
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

								<PaymentMethods />
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
									plans={[
										{
											flag: '🇦🇹',
											name: 'Austria',
											data: '3 GB',
											validity: '10 Days',
											startDate: 'Jun 25',
											originalPrice: '£6.99',
											finalPrice: '£5.94',
										},
										{
											flag: '🇺🇳',
											name: 'Caribbean+',
											data: '1 GB',
											validity: '10 Days',
											startDate: 'Jul 16',
											finalPrice: '£7.99',
										},
									]}
									subtotal="£14.98"
									discount="£1.05"
									bundleDiscount="£1.25"
									total="£12.54"
								/>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
