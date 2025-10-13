'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiService } from '@travelpulse/ui/state';
import { Button } from '@travelpulse/ui';
import { Switch } from '@heroui/switch';
// import UsageChart from './UsageChart'; // your chart component
import styles from './styles.module.scss';
import { SIMDetails, SuccessResponse } from '@travelpulse/interfaces';
import Link from 'next/link';
import { toast } from '@travelpulse/utils';

export default function EsimDetailsPage() {
	const params = useParams();
	const esimId = Array.isArray(params?.esimId)
		? params.esimId[0]
		: (params?.esimId as string | undefined);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sim, setSim] = useState<SIMDetails | null>(null);
	const [showActivation, setShowActivation] = useState(false);
	const [showLpa, setShowLpa] = useState(false);
	// ICCID is shown plainly (no masking) per product decision
	const [apnExpanded, setApnExpanded] = useState(false);

	useEffect(() => {
		if (!esimId) return;
		setLoading(true);
		setError(null);

		ApiService.get(`/esims/${esimId}`)
			.then((res) => {
				const parsed = res.data as SuccessResponse<SIMDetails>;
				setSim(parsed.data);
			})
			.catch(() => {
				setError('Failed to load eSIM details');
			})
			.finally(() => setLoading(false));
	}, [esimId]);

	if (loading) {
		return <div>Loading details…</div>;
	}
	if (error || !sim) {
		return <div>Error: {error || 'Not found'}</div>;
	}

	const isActive = sim.status === 'ACTIVE';
	const planName = sim.name;
	const providerName = sim.order?.orderNumber
		? `Order #${sim.order.orderNumber}`
		: 'Provider';
	const phoneNumber = sim.msisdn ?? undefined;
	const dataLeft = `${sim.remaining} / ${sim.total}`;
	const total = sim.total ?? 0;
	const remaining = sim.remaining ?? 0;
	const used = Math.max(0, total - remaining);
	const percentUsed =
		total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
	const percentRemaining = 100 - percentUsed;
	const expiresOn = sim.expiredAt;
	const expiresDate = expiresOn ? new Date(expiresOn) : null;
	const daysToExpiry = expiresDate
		? Math.ceil(
				(expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
		  )
		: null;
	const isLowData = total > 0 && remaining / total <= 0.1;
	const isExpiringSoon = daysToExpiry !== null && daysToExpiry <= 3;
	const autoRenew = false; // TODO: wire to real field when available

	function fieldCopy<Key extends keyof SIMDetails>(
		keyField: Key,
		message: string
	) {
		if (!sim) return;

		const value = sim[keyField];

		if (!value) return;

		navigator.clipboard.writeText(String(value));

		toast.success({
			title: 'Copied',
			description: message,
		});
	}

	return (
		<>
			<div className={styles.page}>
				{/* Breadcrumbs */}
				<nav className={styles.breadcrumbs} aria-label="Breadcrumb">
					<ol>
						<li>
							<Link href="/app/esims">My eSIMs</Link>
						</li>
						<li aria-current="page">{planName}</li>
					</ol>
				</nav>

				{/* Hero / header section */}
				<div className={styles.hero}>
					<div className={styles.heroLeft}>
						<h1 className={styles.planName}>{planName}</h1>
						<p className={styles.operator}>{providerName}</p>
					</div>
					<span
						className={`${styles.statusChip} ${
							isActive ? styles.active : styles.inactive
						}`}
					>
						{isActive ? 'Active' : 'Inactive'}
					</span>
				</div>

				{/* Alerts */}
				{(isLowData || isExpiringSoon) && (
					<div
						className={`${styles.alertBanner} ${
							isExpiringSoon ? styles.warning : styles.info
						}`}
					>
						<div>
							{isLowData && (
								<span>Data low — consider a top up. </span>
							)}
							{isExpiringSoon && (
								<span>
									{daysToExpiry === 0
										? 'Expires today'
										: `Expires in ${daysToExpiry} day${
												daysToExpiry === 1 ? '' : 's'
										  }`}{' '}
									— renew soon.
								</span>
							)}
						</div>
					</div>
				)}

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
							<div
								className={
									styles.iccidValue + ' ' + styles.mono
								}
							>
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
							<div className={styles.packValue}>{sim.total}</div>
						</div>
						<div className={styles.packItem}>
							<div className={styles.packLabel}>Validity</div>
							<div className={styles.packValue}>—</div>
						</div>
					</div>
					<div className={styles.kvRow}>
						<span>Start</span>
						<span>—</span>
					</div>
					<div className={styles.kvRow}>
						<span>Expires</span>
						<span>{expiresOn}</span>
					</div>
				</section>

				{/* Usage Chart */}
				<section className={styles.usageSection}>
					<h2 className={styles.sectionTitle}>Usage</h2>
					{/* <UsageChart data={sim.usageHistory} /> */}
					<div className={styles.kvRow}>
						<span>Remaining / Total</span>
						<span>{dataLeft}</span>
					</div>
					<div className={styles.kvRow}>
						<span>Used</span>
						<span>{used}</span>
					</div>
					<div
						className={styles.progressWrap}
						aria-label="Usage progress"
					>
						<div className={styles.progressBar}>
							<div
								className={styles.progressFill}
								style={{ width: `${percentUsed}%` }}
							/>
						</div>
						<div className={styles.progressMeta}>
							{percentUsed}% used · {percentRemaining}% left
						</div>
					</div>
				</section>

				{/* Installation */}
				<section className={styles.actionsSection}>
					<h2 className={styles.sectionTitle}>Install your eSIM</h2>
					<div className={styles.installGrid}>
						{sim.qrcodeUrl ? (
							<div className={styles.qrBox}>
								<img
									src={sim.qrcodeUrl}
									alt={`QR code for ${planName}`}
									className={styles.qrImage}
								/>
								<div className={styles.metaLine}>
									Scan to install
								</div>
							</div>
						) : (
							<div className={styles.qrBoxPlaceholder}>
								QR not available
							</div>
						)}

						<div className={styles.codeList}>
							<div className={styles.codeItem}>
								<div className={styles.codeLabel}>
									Activation code
								</div>
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
											onClick={() =>
												setShowActivation((v) => !v)
											}
										>
											{showActivation ? 'Hide' : 'Reveal'}
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												fieldCopy(
													'activationCode',
													'Activation code copied'
												);
											}}
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
											onClick={() =>
												setShowLpa((v) => !v)
											}
										>
											{showLpa ? 'Hide' : 'Reveal'}
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												fieldCopy(
													'lpa',
													'LPA address copied'
												);
											}}
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
										{Object.entries(sim.apn).map(
											([k, v]) => (
												<div
													key={k}
													className={styles.apnCard}
												>
													<div
														className={
															styles.apnTitle
														}
													>
														{k}
													</div>
													<div
														className={styles.kvRow}
													>
														<span>Type</span>
														<span
															className={
																styles.mono
															}
														>
															{v.apn_type}
														</span>
													</div>
													<div
														className={styles.kvRow}
													>
														<span>Value</span>
														<span
															className={
																styles.mono
															}
														>
															{v.apn_value ?? '—'}
														</span>
													</div>
												</div>
											)
										)}
									</div>
									<div className={styles.inlineActions}>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setApnExpanded(false)
											}
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
						<span>
							{sim.order ? `#${sim.order.orderNumber}` : '—'}
						</span>
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

				{/* Alerts / banners */}
				{/* {sim.alert && (
        <div className={`${styles.alertBanner} ${styles[sim.alert.type]}`}>
          {sim.alert.message}
          {sim.alert.cta && (
            <button onClick={sim.alert.onClick}>{sim.alert.cta}</button>
          )}
        </div>
      )} */}

				{/* Actions / Connect / Install */}
				<section className={styles.actionsSection}>
					<h2 className={styles.sectionTitle}>Actions</h2>
					<div className={styles.actionRow}>
						<Button
							onClick={() => {
								/* install / share */
							}}
						>
							Install / Share
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								/* show connect instructions */
							}}
						>
							Connect instructions
						</Button>
						{/* {sim.canDeactivate && (
            <Button variant="danger" onClick={() => {}}>
              Deactivate
            </Button>
          )} */}
					</div>
				</section>

				{/* Auto-renew */}
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

				{/* Misc / Support / Logs */}
				<section className={styles.miscSection}>
					<h2 className={styles.sectionTitle}>More</h2>
					<ul className={styles.miscList}>
						<li>
							<button
								onClick={() => {
									/* view logs */
								}}
							>
								Usage logs
							</button>
						</li>
						<li>
							<button
								onClick={() => {
									/* help/FAQ */
								}}
							>
								Help & FAQs
							</button>
						</li>
						<li>
							<button
								onClick={() => {
									/* contact support */
								}}
							>
								Contact support
							</button>
						</li>
					</ul>
				</section>
			</div>
			{/* Sticky action bar */}
			<div className={styles.stickyBar}>
				<div className={styles.stickyInner}>
					<Button
						onClick={() => {
							/* install / share */
						}}
					>
						Install / Share
					</Button>
					<Button variant="outline">Connect instructions</Button>
				</div>
			</div>
		</>
	);
}
