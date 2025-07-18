'use client';

import React from 'react';
import styles from './order-summary.module.scss';

interface PlanItem {
	flag: string;
	name: string;
	data: string;
	validity: string;
	startDate: string;
	originalPrice?: string;
	finalPrice: string;
}

interface OrderSummaryProps {
	plans: PlanItem[];
	subtotal: string;
	discount: string;
	bundleDiscount: string;
	total: string;
	currency?: string;
}

export function OrderSummary({
	plans,
	subtotal,
	discount,
	bundleDiscount,
	total,
	currency = 'GBP',
}: OrderSummaryProps) {
	return (
		<div className={styles.container}>
			<div className={styles.planList}>
				{plans.map((plan, i) => (
					<div
						className={styles.planCard}
						key={`order-summary-plan-${i}`}
					>
						<div className={styles.planHeader}>
							<span className={styles.flag}>{plan.flag}</span>
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
								<strong>{plan.startDate}</strong>
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
										{plan.finalPrice}
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
					<span>{subtotal}</span>
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
						{total} {currency}
					</span>
				</div>
			</div>

			<p className={styles.note}>
				Your payment will be charged in <strong>{currency}</strong>.
			</p>
		</div>
	);
}
