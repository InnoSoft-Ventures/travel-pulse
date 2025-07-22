'use client';

import React from 'react';
import styles from './order-summary.module.scss';
import { CartItem } from '@travelpulse/interfaces';
import { dateJs } from '@travelpulse/utils';
import Image from 'next/image';

interface OrderSummaryProps {
	cartItems: CartItem[];
	total: number;
	currency: string;
}

export function OrderSummary(props: OrderSummaryProps) {
	const { cartItems, total, currency } = props;

	const discount = '£1.05';
	const bundleDiscount = '£1.25';

	return (
		<div className={styles.container}>
			<div className={styles.planList}>
				{cartItems.map((plan, i) => (
					<div
						className={styles.planCard}
						key={`order-summary-plan-${i}`}
					>
						<div className={styles.planHeader}>
							{plan.flag && (
								<div className={styles.flag}>
									<Image
										src={plan.flag}
										alt={`${plan.name} flag`}
										width={36}
										height={20}
										className={styles.flagImage}
									/>
								</div>
							)}
							<div>
								{plan.name}{' '}
								<span className={styles.eSim}>eSIM</span>
							</div>
						</div>

						<ul className={styles.planDetails}>
							<li>
								<span>Data Allowance:</span>{' '}
								<strong>{plan.data}</strong>
							</li>
							<li>
								<span>Validity:</span>{' '}
								<strong>{plan.validity}</strong>
							</li>
							<li>
								<span>Starting Date:</span>{' '}
								<strong>
									{dateJs(plan.startDate).format('DD MMM')}
								</strong>
							</li>
							<li>
								Item Total:{' '}
								<div className={styles.priceContainer}>
									{plan.originalPrice && (
										<div className={styles.oldPrice}>
											{plan.originalPrice}
										</div>
									)}{' '}
									<span className={styles.price}>
										{`${currency}${plan.finalPrice}`}
									</span>
								</div>
							</li>
						</ul>
					</div>
				))}
			</div>

			<div className={styles.summary}>
				<div className={styles.row}>
					<span>Subtotal</span>
					<span>{`${currency}${total}`}</span>
				</div>
				<div className={styles.row}>
					<span className={styles.discount}>Discount</span>
					<span className={styles.discount}>({discount})</span>
				</div>
				<div className={styles.row}>
					<span className={styles.discount}>Bundle Discount</span>
					<span className={styles.discount}>({bundleDiscount})</span>
				</div>
				<div className={styles.row}>
					<span>Taxes & Fees</span>
					<span>Included</span>
				</div>
				<div className={styles.totalRow}>
					<span>Total</span>
					<span>
						{currency}
						{total}
					</span>
				</div>
			</div>

			<p className={styles.note}>
				Your payment will be charged in <strong>{currency}</strong>.
			</p>
		</div>
	);
}
