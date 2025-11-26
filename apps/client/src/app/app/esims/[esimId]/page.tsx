'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { Button } from '@travelpulse/ui';
import styles from './styles.module.scss';
import Link from 'next/link';
import { capitalizeFirstLetter, elementScrollTo } from '@travelpulse/utils';
import { fetchSimDetails } from '@travelpulse/ui/thunks';
import SimUsage from './sim-usage';
import SimInstall from './sim-install';
import { SimUtil } from './sim-util';
import SupportSection from './support-section';
import NetworkAndOrder from './network-and-order';
import IdentifiersPlan from './identifiers-plan';
import SimAlert from './sim-alerts';
import SimAutoRenew from './sim-auto-renew';
import { SimStatus } from '@travelpulse/interfaces';

export default function EsimDetailsPage() {
	const params = useParams();
	const esimId = Array.isArray(params?.esimId)
		? params.esimId[0]
		: (params?.esimId as string | undefined);

	const dispatch = useAppDispatch();
	const {
		status,
		error,
		data: sim,
	} = useAppSelector((state) => state.account.sims.simDetails);

	useEffect(() => {
		if (!esimId) return;

		if (window.location.hash === '#connect') {
			elementScrollTo('connect-share');
		}

		dispatch(fetchSimDetails({ simId: esimId }));
	}, [esimId]);

	// if (status === 'loading') {
	// 	return <div>Loading details…</div>;
	// }

	if (error || !sim) {
		return <div>Error: {error?.toString() || 'Not found'}</div>;
	}

	const isNotActive = sim.status === SimStatus.NOT_ACTIVE;
	const planName = sim.name;
	const providerName = sim.order?.orderNumber
		? `Order #${sim.order.orderNumber}`
		: 'Provider';

	const autoRenew = false; // TODO: wire to real field when available
	const fieldCopy = new SimUtil(sim).copyField;

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
						{(sim.country || sim.continent) && (
							<div className={styles.countryRow}>
								{sim.country?.flag ? (
									<img
										src={sim.country.flag}
										alt={`${sim.country.name} flag`}
										className={styles.countryFlag}
									/>
								) : sim.continent ? (
									<span
										className={styles.flagPlaceholder}
										aria-label={`${sim.continent.name} placeholder flag`}
										role="img"
									>
										🌐
									</span>
								) : null}
								<span className={styles.countryName}>
									{sim.country?.name ?? sim.continent?.name}
								</span>
							</div>
						)}
						<h1 className={styles.planName}>{planName}</h1>
						<p className={styles.operator}>{providerName}</p>
					</div>
					<span
						className={`${styles.statusChip} ${
							sim.status === SimStatus.ACTIVE
								? styles.active
								: styles.inactive
						}`}
					>
						{capitalizeFirstLetter(sim.status)}
					</span>
				</div>

				{/* Alerts */}
				<SimAlert sim={sim} />

				{/* Identifiers & Plan Info */}
				<IdentifiersPlan sim={sim} fieldCopy={fieldCopy} />

				{/* Usage Chart */}
				<SimUsage sim={sim} />

				{/* Installation */}
				{isNotActive && <SimInstall sim={sim} fieldCopy={fieldCopy} />}

				<NetworkAndOrder sim={sim} />

				{/* Auto-renew */}
				<SimAutoRenew autoRenew={autoRenew} planName={planName} />

				{/* Misc / Support / Logs */}
				<SupportSection />
			</div>

			{/* Sticky action bar */}
			<div className={styles.stickyBar}>
				<div className={styles.stickyInner}>
					<Button
						onClick={() => {
							if (isNotActive) {
								elementScrollTo('connect-share');
							}
						}}
					>
						{isNotActive ? 'Install / Share' : 'Top Up'}
					</Button>

					{isNotActive && (
						<Button variant="outline">Connect instructions</Button>
					)}
				</div>
			</div>
		</>
	);
}
