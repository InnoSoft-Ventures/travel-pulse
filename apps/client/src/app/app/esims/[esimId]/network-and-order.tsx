'use client';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import { SIMDetails } from '@travelpulse/interfaces';
import { Button } from '@travelpulse/ui';

interface NetworkAndOrderProps {
	sim: SIMDetails;
}

export default function NetworkAndOrder({ sim }: NetworkAndOrderProps) {
	// ICCID is shown plainly (no masking) per product decision
	const [apnExpanded, setApnExpanded] = useState(false);

	return (
		<>
			{/* Network & APN */}
			<section className={styles.actionsSection}>
				<h2 className={styles.sectionTitle}>Network & APN</h2>
				<div className={styles.kvRow}>
					<span>Roaming</span>
					<span>{sim.isRoaming ? 'On' : 'Off'}</span>
				</div>
				<div className={styles.kvRow}>
					<span>APN mode</span>
					<span>
						<span className={styles.badge}>{sim.apnType}</span>
					</span>
				</div>
				{sim.apnValue && (
					<div className={styles.kvRow}>
						<span>APN value</span>
						<span className={styles.mono}>{sim.apnValue}</span>
					</div>
				)}
				{sim.apn && (
					<>
						{!apnExpanded && (
							<div className={styles.kvRow}>
								<span>APN details</span>
								<span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setApnExpanded(true)}
									>
										Show more
									</Button>
								</span>
							</div>
						)}
						{apnExpanded && (
							<>
								<div className={styles.apnGrid}>
									{Object.entries(sim.apn).map(([k, v]) => (
										<div key={k} className={styles.apnCard}>
											<div className={styles.apnTitle}>
												{k}
											</div>
											<div className={styles.kvRow}>
												<span>Type</span>
												<span className={styles.mono}>
													{v.apn_type}
												</span>
											</div>
											<div className={styles.kvRow}>
												<span>Value</span>
												<span className={styles.mono}>
													{v.apn_value ?? '—'}
												</span>
											</div>
										</div>
									))}
								</div>
								<div className={styles.inlineActions}>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setApnExpanded(false)}
									>
										Hide
									</Button>
								</div>
							</>
						)}
					</>
				)}
			</section>

			{/* Provider / Order */}
			<section className={styles.actionsSection}>
				<h2 className={styles.sectionTitle}>Provider & Order</h2>
				<div className={styles.kvRow}>
					<span>Order</span>
					<span>{sim.order ? `#${sim.order.orderNumber}` : '—'}</span>
				</div>
				{sim.providerOrder && (
					<div className={styles.kvRow}>
						<span>Package</span>
						<span className={styles.mono}>
							{sim.providerOrder.packageId} ·{' '}
							{sim.providerOrder.type}
							{sim.providerOrder.price
								? ` · ${sim.providerOrder.price} ${
										sim.providerOrder.currency ?? ''
								  }`
								: ''}
						</span>
					</div>
				)}
			</section>
		</>
	);
}
