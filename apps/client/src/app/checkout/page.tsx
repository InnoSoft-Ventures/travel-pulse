import React from 'react';
import { MinimalNav, PaymentCard, Paypal, Title } from '@travelpulse/ui';
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
				<Title size="size35">Secure Checkout</Title>

				<div>
					<div>
						<div>
							<div>Create account</div>
							<form action="">{/* Signup form */}</form>
						</div>

						<div>
							<Title size="size16">Payment Details</Title>
							<div className={style.choosePaymentMethodTxt}>
								You can choose or change the payment method to
								complete your order.
							</div>

							<div className={style.paymentMethodsContainer}>
								<PaymentCard />
								<Paypal />
							</div>
						</div>
					</div>
					<div></div>
				</div>
			</main>
		</div>
	);
}
