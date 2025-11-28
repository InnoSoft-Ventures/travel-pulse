'use client';
import React, { useState, memo, useCallback } from 'react';
import { Button } from '@travelpulse/ui';
import styles from './styles.module.scss';
import { SIMDetails, SIMInfo } from '@travelpulse/interfaces';
import { SimUtilConfig } from './sim-util';

interface SimInstallProps {
	sim: SIMDetails;
	fieldCopy: SimUtilConfig['copyField'];
}

function SimInstallComponent({ sim, fieldCopy }: SimInstallProps) {
	const [showActivation, setShowActivation] = useState(false);
	const [showLpa, setShowLpa] = useState(false);

	// Memoize callbacks to prevent re-creating functions on every render
	const toggleActivation = useCallback(
		() => setShowActivation((v) => !v),
		[]
	);
	const toggleLpa = useCallback(() => setShowLpa((v) => !v), []);

	const copyActivationCode = useCallback(() => {
		fieldCopy('activationCode', 'Activation code copied');
	}, [fieldCopy]);

	const copyLpa = useCallback(() => {
		fieldCopy('lpa', 'LPA address copied');
	}, [fieldCopy]);

	return (
		<section className={styles.actionsSection} id="connect-share">
			<h2 className={styles.sectionTitle}>Install your eSIM</h2>
			<div className={styles.installGrid}>
				{sim.qrcodeUrl ? (
					<div className={styles.qrBox}>
						<img
							src={sim.qrcodeUrl}
							alt={`QR code for ${sim.name}`}
							className={styles.qrImage}
						/>
						<div className={styles.metaLine}>Scan to install</div>
					</div>
				) : (
					<div className={styles.qrBoxPlaceholder}>
						QR not available
					</div>
				)}

				<div className={styles.codeList}>
					<div className={styles.codeItem}>
						<div className={styles.codeLabel}>Activation code</div>
						<div className={styles.codeBox}>
							<code>
								{showActivation
									? sim.activationCode || '—'
									: sim.activationCode
									? '••••••••••'
									: '—'}
							</code>
							<div className={styles.inlineActions}>
								<Button
									variant="outline"
									size="sm"
									onClick={toggleActivation}
								>
									{showActivation ? 'Hide' : 'Reveal'}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={copyActivationCode}
								>
									Copy
								</Button>
							</div>
						</div>
					</div>

					<div className={styles.codeItem}>
						<div className={styles.codeLabel}>
							LPA (SM-DP+ address)
						</div>
						<div className={styles.codeBox}>
							<code>
								{showLpa
									? sim.lpa || '—'
									: sim.lpa
									? '••••••••••'
									: '—'}
							</code>
							<div className={styles.inlineActions}>
								<Button
									variant="outline"
									size="sm"
									onClick={toggleLpa}
								>
									{showLpa ? 'Hide' : 'Reveal'}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={copyLpa}
								>
									Copy
								</Button>
							</div>
						</div>
					</div>

					<div className={styles.inlineActions}>
						{sim.directAppleInstallationUrl && (
							<Button
								as="a"
								href={sim.directAppleInstallationUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Install on iOS
							</Button>
						)}
						{sim.qrcodeUrl && (
							<Button
								as="a"
								variant="outline"
								href={sim.qrcodeUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Download QR
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

// Memoize to prevent unnecessary re-renders
export default memo(SimInstallComponent);
