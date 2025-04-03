import React from 'react';
import Link from 'next/link';
import { Button } from '../common';
import styles from './plan-card.module.scss';
import Network5GIcon from '../../assets/network-5g.svg';

export function PlanCard() {
	return (
		<div className={styles.planCard}>
			<div className={styles.badge}>
				<div>South Africa</div>
			</div>

			<div className={styles.info}>
				<div className={styles.row}>
					<span className={styles.networkData}>
						<Network5GIcon /> <strong>10 GB</strong>
					</span>
					<span>
						<strong>$15.00</strong> USD
					</span>
				</div>

				<div className={styles.row}>
					<span>Coverage</span>
					<span>South Africa</span>
				</div>

				<div className={styles.row}>
					<span>Validity</span>
					<span>
						<strong>15 Days</strong>
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
					<Link href="#">Plan details</Link>
					<Button>Buy Now</Button>
				</div>
			</div>
		</div>
	);
}
