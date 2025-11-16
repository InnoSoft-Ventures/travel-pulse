'use client';

import React, { useEffect } from 'react';
import styles from './order-summary.module.scss';
import { dateJs } from '@travelpulse/utils';
import Image from 'next/image';
import { CopyIcon, TrashIcon } from 'lucide-react';
import { CartState, removeFromCart, useAppDispatch } from '@travelpulse/state';
import { processCart } from '@travelpulse/state/thunks';
import { Icon } from '../../common';

interface OrderSummaryProps {
	cartState: CartState;
}

export function OrderSummary({ cartState }: OrderSummaryProps) {
	const { items, details } = cartState;
	const {
		totalPrice,
		currency,
		taxesAndFees,
		bundleDiscount,
		discount,
		subtotal,
	} = details;

	const dispatch = useAppDispatch();

	const cartItems = items.list;

	useEffect(() => {
		dispatch(processCart());
	}, [dispatch]);

	const handleDelete = (index: number) => {
		dispatch(removeFromCart(index));
	};

	// const handleCopy = (plan: PlanItem) => {
	// 	setCartItems((prev) => [...prev, { ...plan }]);
	// };

	return (
		<div className={styles.container}>
			<div className={styles.planList}>
				{items.status === 'succeeded' &&
					cartItems.map((plan, i) => (
						<div
							className={styles.planCard}
							key={`order-summary-plan-${i}`}
						>
							{/* Top-right action buttons */}
							<div className={styles.actionButtons}>
								<button
									className={styles.copyBtn}
									// onClick={() => handleCopy(plan)}
									title="Duplicate"
								>
									<CopyIcon size={16} />
								</button>

								<span className={styles.divider} />

								<button
									className={styles.deleteBtn}
									onClick={() => handleDelete(i)}
									title="Remove"
								>
									<TrashIcon size={16} />
								</button>
							</div>

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
								<div className={styles.planName}>
									{plan.name}{' '}
									<span className={styles.eSim}>eSIM</span>
									{plan.quantity > 1 && (
										<span className={styles.quantity}>
											<span>x</span> {plan.quantity}
										</span>
									)}
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
										{dateJs(plan.startDate).format(
											'DD MMM'
										)}
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
											{plan.finalPrice}
										</span>
									</div>
								</li>
							</ul>
						</div>
					))}

				{items.status === 'loading' && (
					<div>
						<Icon name="LoaderCircle" />
						<div>Loading cart items...</div>
					</div>
				)}

				{items.status === 'failed' && (
					<div>Error loading cart items</div>
				)}
			</div>

			<div className={styles.summary}>
				<div className={styles.row}>
					<span>Subtotal</span>
					<span>{subtotal}</span>
				</div>
				{discount > 0 && (
					<div className={styles.row}>
						<span className={styles.discount}>Discount</span>
						<span className={styles.discount}>({discount})</span>
					</div>
				)}

				{bundleDiscount > 0 && (
					<div className={styles.row}>
						<span className={styles.discount}>Bundle Discount</span>
						<span className={styles.discount}>
							({bundleDiscount})
						</span>
					</div>
				)}

				<div className={styles.row}>
					<span>Taxes & Fees</span>
					<span>{taxesAndFees}</span>
				</div>
				<div className={styles.totalRow}>
					<span>Total</span>
					<span>{totalPrice}</span>
				</div>
			</div>

			<p className={styles.note}>
				Your payment will be charged in <strong>{currency}</strong>.
			</p>
		</div>
	);
}
