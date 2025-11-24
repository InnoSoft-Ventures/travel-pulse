import React from 'react';
import styles from './styles.module.scss';
import { Switch } from '@heroui/switch';

interface SimAutoRenewProps {
	autoRenew: boolean;
	planName: string;
}

export default function SimAutoRenew({
	autoRenew,
	planName,
}: SimAutoRenewProps) {
	return (
		<section className={styles.renewSection}>
			<h2 className={styles.sectionTitle}>Auto-renewal</h2>
			<div className={styles.renewControl}>
				<span>{autoRenew ? 'On' : 'Off'}</span>
				<Switch
					isSelected={!!autoRenew}
					size="sm"
					aria-label={`Auto renew ${planName}`}
					isDisabled
				/>
			</div>
			{/* {sim.nextRenewalDate && (
							<p className={styles.nextRenewal}>Next renewal: {sim.nextRenewalDate}</p>
						)} */}
		</section>
	);
}
