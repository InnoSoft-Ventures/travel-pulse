'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchPackageHistory } from '@travelpulse/ui/thunks';
import { PackageHistoryItem, SimStatus } from '@travelpulse/interfaces';
import { capitalizeFirstLetter, formatDataSize } from '@travelpulse/utils';
import styles from './package-history.module.scss';

interface PackageHistoryProps {
	simId: number;
}

export default function PackageHistory({ simId }: PackageHistoryProps) {
	const dispatch = useAppDispatch();
	const [isExpanded, setIsExpanded] = useState(false);

	const historySlice = useAppSelector(
		(state) => state.account.sims.packageHistory
	);
	const { list = [], status = 'idle', error } = historySlice || {};

	useEffect(() => {
		dispatch(fetchPackageHistory({ simId }));
	}, [simId, dispatch]);

	const toggleSection = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<section className={styles.historySection}>
			<button
				type="button"
				className={styles.headerButton}
				onClick={toggleSection}
				aria-expanded={isExpanded}
			>
				<span className={styles.sectionTitle}>Package History</span>
				<span className={styles.chevron}>{isExpanded ? '▼' : '▶'}</span>
			</button>

			{isExpanded && (
				<div className={styles.historyContent}>
					{status === 'loading' && (
						<div className={styles.loading}>Loading history…</div>
					)}

					{status === 'failed' && error && (
						<div className={styles.errorText}>
							Failed to load history:{' '}
							{typeof error === 'string'
								? error
								: 'Unknown error'}
						</div>
					)}

					{status === 'succeeded' && list.length === 0 && (
						<div className={styles.empty}>
							No package history found for this eSIM.
						</div>
					)}

					{status === 'succeeded' && list.length > 0 && (
						<div className={styles.historyList}>
							{list.map((item) => (
								<PackageHistoryCard key={item.id} item={item} />
							))}
						</div>
					)}
				</div>
			)}
		</section>
	);
}

interface PackageHistoryCardProps {
	item: PackageHistoryItem;
}

function PackageHistoryCard({ item }: PackageHistoryCardProps) {
	const statusClass = styles[getStatusClass(item.status)];

	const isUnlimited = item.isUnlimited;
	const hasTotals = !!item.totalDataMB;

	const remaining =
		!isUnlimited && hasTotals ? item.remainingDataMB ?? 0 : null;
	const total = !isUnlimited && hasTotals ? item.totalDataMB ?? 0 : null;

	const dataText = isUnlimited
		? 'Unlimited'
		: total
		? `${formatDataSize(remaining ?? 0)} / ${formatDataSize(total)}`
		: null;

	let progressPercent: number | null = null;
	if (
		!isUnlimited &&
		typeof remaining === 'number' &&
		typeof total === 'number' &&
		total > 0
	) {
		const ratio = Math.min(Math.max(remaining / total, 0), 1);
		progressPercent = ratio * 100;
	}

	return (
		<div className={styles.historyCard}>
			{/* Top row now only wraps the whole content visually; chip moves down */}
			<div className={styles.cardHeader}>
				{/* We don't show validity here anymore */}
				<div />{' '}
				{/* keeps spacing; you can remove & adjust CSS if you like */}
			</div>

			<div className={styles.bodyRow}>
				{/* LEFT: Data + status */}
				<div className={styles.leftBlock}>
					<div className={styles.usageBlock}>
						<span className={styles.usageIcon}>📊</span>
						<div className={styles.usageDetails}>
							<div className={styles.usageHeaderRow}>
								<span className={styles.usageLabel}>Data</span>
							</div>

							{dataText && (
								<span className={styles.usageValue}>
									{dataText}
								</span>
							)}

							{progressPercent !== null && (
								<div className={styles.progressBar}>
									<div
										className={styles.progressFill}
										style={{ width: `${progressPercent}%` }}
									/>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* RIGHT: Validity + dates */}
				<div className={styles.metaBlock}>
					<span className={`${styles.statusChip} ${statusClass}`}>
						{capitalizeFirstLetter(
							item.status === SimStatus.NOT_ACTIVE
								? 'Inactive'
								: item.status
						)}
					</span>

					{item.validityDays && (
						<div className={styles.metaItemInline}>
							<span className={styles.metaLabel}>Validity</span>
							<span className={styles.metaValue}>
								{item.validityDays} days
							</span>
						</div>
					)}

					{item.activatedAt && (
						<div className={styles.metaItemInline}>
							<span className={styles.metaLabel}>Activated</span>
							<span className={styles.metaValue}>
								{item.activatedAt}
							</span>
						</div>
					)}

					{item.expiresAt && (
						<div className={styles.metaItemInline}>
							<span className={styles.metaLabel}>Expires</span>
							<span className={styles.metaValue}>
								{item.expiresAt}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function getStatusClass(status: SimStatus): string {
	switch (status) {
		case SimStatus.ACTIVE:
			return 'statusActive';
		case SimStatus.FINISHED:
		case SimStatus.EXPIRED:
			return 'statusExpired';
		case SimStatus.NOT_ACTIVE:
			return 'statusInactive';
		case SimStatus.DEACTIVATED:
		case SimStatus.RECYCLED:
			return 'statusDeactivated';
		default:
			return 'statusUnknown';
	}
}
