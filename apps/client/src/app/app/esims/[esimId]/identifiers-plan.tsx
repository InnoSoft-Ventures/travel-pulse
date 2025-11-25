import React from 'react';
import styles from './styles.module.scss';
import { SIMDetails } from '@travelpulse/interfaces';
import { SimUtilConfig } from './sim-util';
import { formatDataSize } from '@travelpulse/utils';

interface IdentifiersPlanProps {
	sim: SIMDetails;
	fieldCopy: SimUtilConfig['copyField'];
}

export default function IdentifiersPlan({
	sim,
	fieldCopy,
}: IdentifiersPlanProps) {
	const phoneNumber = sim.msisdn ?? undefined;
	const expiresOn = sim.expiredAt;

	return (
		<>
			{/* Identifiers */}
			<section className={styles.identifiers}>
				<h2 className={styles.sectionTitle}>Identifiers</h2>
				<div className={styles.iccidCard}>
					<div className={styles.iccidBox}>
						<div className={styles.iccidHeaderRow}>
							<div className={styles.iccidLabel}>ICCID</div>
							{sim.iccid && (
								<button
									type="button"
									aria-label="Copy ICCID"
									className={styles.iconButton}
									onClick={() => {
										fieldCopy('iccid', 'ICCID copied');
									}}
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="9"
											y="9"
											width="13"
											height="13"
											rx="2"
											stroke="currentColor"
											strokeWidth="2"
										/>
										<rect
											x="3"
											y="3"
											width="13"
											height="13"
											rx="2"
											stroke="currentColor"
											strokeWidth="2"
										/>
									</svg>
								</button>
							)}
						</div>
						<div className={styles.iccidValue + ' ' + styles.mono}>
							{sim.iccid ?? '—'}
						</div>
					</div>
				</div>
				{/* EID not present on SIMDetails; omit or show placeholder if available later */}
				{phoneNumber && (
					<div className={styles.kvRow}>
						<span>Phone</span>
						<span>{phoneNumber}</span>
					</div>
				)}
			</section>

			{/* Plan / Package Info */}
			<section className={styles.planInfo}>
				<h2 className={styles.sectionTitle}>Plan & Validity</h2>
				<div className={styles.packRow}>
					<div className={styles.packItem}>
						<div className={styles.packLabel}>Data</div>
						<div className={styles.packValue}>
							{formatDataSize(sim.total)}
						</div>
					</div>
					<div className={styles.packItem}>
						<div className={styles.packLabel}>Validity</div>
						<div className={styles.packValue}>{sim.validity}</div>
					</div>
					<div className={styles.packItem}>
						<div className={styles.packLabel}>Expires</div>
						<div className={styles.packValue}>{expiresOn}</div>
					</div>
				</div>
			</section>
		</>
	);
}
