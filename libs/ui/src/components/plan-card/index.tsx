import React from 'react';
import { Button } from '../common';
import styles from './plan-card.module.scss';
import Network5GIcon from '../../assets/network-5g.svg';
import { UIPlan } from '@travelpulse/interfaces';

interface PlanCardProps {
	details: UIPlan;
	showPlanDetails: () => void;
}

export function PlanCard(props: PlanCardProps) {
	const { details, showPlanDetails } = props;

	return (
		<div className={styles.planCard}>
			<div className={styles.badge}>
				<div>South Africa</div>
			</div>

			<div className={styles.info}>
				<div className={styles.row}>
					<span className={styles.networkData}>
						<Network5GIcon /> <strong>{details.data}</strong>
					</span>
					<span>
						<strong>${details.price}</strong> USD
					</span>
				</div>

				<div className={styles.row}>
					<span>Coverage</span>
					<span>South Africa</span>
				</div>

				<div className={styles.row}>
					<span>Validity</span>
					<span>
						<strong>{details.duration}</strong>
					</span>
				</div>

				<div className={styles.row}>
					<span>Service</span>
					<span>
						<strong>Data Only</strong>
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
					<Button className={styles.buyNowBtn}>Buy Now</Button>
				</div>
			</div>
		</div>
	);
}
