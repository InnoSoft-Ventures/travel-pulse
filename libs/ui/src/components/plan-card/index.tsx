'use client';
import React from 'react';
import { Button } from '../common';
import styles from './plan-card.module.scss';
import Network5GIcon from '../../assets/network-5g.svg';
import { PackageInterface } from '@travelpulse/interfaces';
import { useRouter } from 'next/navigation';
import { addToCart, useAppDispatch } from '@travelpulse/state';
import { DATE_FORMAT, dateJs } from '@travelpulse/utils';

interface PlanCardProps {
	packageDetails: PackageInterface;
	showPlanDetails: () => void;
	startDate: dateJs.Dayjs;
}

export function PlanCard(props: PlanCardProps) {
	const { packageDetails, showPlanDetails, startDate } = props;

	const router = useRouter();
	const dispatch = useAppDispatch();

	let title = '';

	if (packageDetails.continent) {
		title = packageDetails.continent.name;
	} else {
		title = packageDetails.countries?.length
			? packageDetails.countries[0].name
			: '';
	}

	let coverage = '';

	if (packageDetails.countries.length === 1) {
		coverage = packageDetails.countries[0].name;
	} else {
		coverage =
			packageDetails.countries.length > 1
				? `${packageDetails.countries.length} countries`
				: 'No coverage';
	}

	function onBuyNow() {
		console.log('Buy Now clicked for:', packageDetails.title);

		// Add the package to the cart
		dispatch(
			addToCart({
				packageItem: packageDetails,
				startDate: startDate.format(DATE_FORMAT),
			})
		);

		// Redirect to the checkout page
		router.push('/checkout');
	}

	return (
		<div className={styles.planCard}>
			{title && (
				<div className={styles.badge}>
					<div>{title}</div>
				</div>
			)}

			<div className={styles.info}>
				<div className={styles.row}>
					<span className={styles.networkData}>
						<Network5GIcon /> <strong>{packageDetails.data}</strong>
					</span>
					<span>
						<strong>${packageDetails.price}</strong> USD
					</span>
				</div>

				<div className={styles.row}>
					<span>Coverage</span>
					<span>{coverage}</span>
				</div>

				<div className={styles.row}>
					<span>Validity</span>
					<span>
						<strong>{packageDetails.day} day(s)</strong>
					</span>
				</div>

				<div className={styles.row}>
					<span>Service</span>
					<span>
						<strong>{packageDetails.planType}</strong>
					</span>
				</div>

				<hr />

				<div className={styles.actions}>
					<button
						onClick={showPlanDetails}
						className={styles.planDetailsBtn}
					>
						Plan details
					</button>
					<Button className={styles.buyNowBtn} onClick={onBuyNow}>
						Buy Now
					</Button>
				</div>
			</div>
		</div>
	);
}
