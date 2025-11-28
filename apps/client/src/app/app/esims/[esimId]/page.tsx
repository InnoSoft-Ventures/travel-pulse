'use client';

import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { Button } from '@travelpulse/ui';
import styles from './styles.module.scss';
import Link from 'next/link';
import { capitalizeFirstLetter, elementScrollTo } from '@travelpulse/utils';
import { fetchSimDetails } from '@travelpulse/ui/thunks';
import { SimUtil } from './sim-util';
import { SimStatus } from '@travelpulse/interfaces';

// Lazy load heavy components for code splitting
const SimUsage = lazy(() => import('./sim-usage'));
const SimInstall = lazy(() => import('./sim-install'));
const NetworkAndOrder = lazy(() => import('./network-and-order'));
const PackageHistory = lazy(() => import('./package-history'));
const SimAutoRenew = lazy(() => import('./sim-auto-renew'));
const SupportSection = lazy(() => import('./support-section'));

// Eagerly load above-the-fold components
import IdentifiersPlan from './identifiers-plan';
import SimAlert from './sim-alerts';

// Loading skeleton component
const SectionSkeleton = () => (
	<div className={styles.actionsSection} style={{ minHeight: '100px' }}>
		<div className={styles.skeletonPulse} />
	</div>
);

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

	// All hooks must be called before any conditional returns
	// Memoize computed values to prevent unnecessary recalculations
	const isNotActive = useMemo(
		() => sim?.status === SimStatus.NOT_ACTIVE,
		[sim?.status]
	);
	const planName = sim?.name;
	const providerName = useMemo(
		() =>
			sim?.order?.orderNumber
				? `Order #${sim.order.orderNumber}`
				: 'Provider',
		[sim?.order?.orderNumber]
	);

	const autoRenew = false; // TODO: wire to real field when available
	const fieldCopy = useMemo(() => (sim ? new SimUtil(sim).copyField : () => {}), [sim]);

	useEffect(() => {
		if (!esimId) return;

		if (window.location.hash === '#connect') {
			elementScrollTo('connect-share');
		}

		dispatch(fetchSimDetails({ simId: esimId }));
	}, [esimId, dispatch]);

	// if (status === 'loading') {
	// 	return <div>Loading details…</div>;
	// }

	if (error || !sim) {
		return <div>Error: {error?.toString() || 'Not found'}</div>;
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
						{capitalizeFirstLetter(
							sim.status === SimStatus.NOT_ACTIVE
								? 'in active'
								: sim.status
						)}
					</span>
				</div>

				{/* Alerts */}
				<SimAlert sim={sim} />

				{/* Identifiers & Plan Info - Critical, render immediately */}
				<IdentifiersPlan sim={sim} fieldCopy={fieldCopy} />

				{/* Below-the-fold sections - Lazy load with suspense */}
				<Suspense fallback={<SectionSkeleton />}>
					<SimUsage sim={sim} />
				</Suspense>

				{/* Installation - Conditionally render */}
				{isNotActive && (
					<Suspense fallback={<SectionSkeleton />}>
						<SimInstall sim={sim} fieldCopy={fieldCopy} />
					</Suspense>
				)}

				<Suspense fallback={<SectionSkeleton />}>
					<NetworkAndOrder sim={sim} />
				</Suspense>

				{/* Package History - Already has internal lazy loading */}
				<Suspense fallback={<SectionSkeleton />}>
					<PackageHistory simId={sim.id} />
				</Suspense>

				<Suspense fallback={<SectionSkeleton />}>
					<SimAutoRenew autoRenew={autoRenew} planName={planName || ''} />
				</Suspense>

				<Suspense fallback={<SectionSkeleton />}>
					<SupportSection />
				</Suspense>
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
