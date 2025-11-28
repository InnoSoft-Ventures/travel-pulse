'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchPackageHistory } from '@travelpulse/ui/thunks';
import { PackageHistoryItem, SimStatus } from '@travelpulse/interfaces';
import { capitalizeFirstLetter } from '@travelpulse/utils';
import styles from './package-history.module.scss';

interface PackageHistoryProps {
	simId: number;
}

export default function PackageHistory({ simId }: PackageHistoryProps) {
	const dispatch = useAppDispatch();
	const [isExpanded, setIsExpanded] = useState(false);

	// Fetch history from state, keyed by simId
	const historySlice = useAppSelector(
		(state) => state.account.sims.packageHistory
	);
	const { list = [], status = 'idle', error } = historySlice || {};

	// On first expansion, dispatch fetch
	useEffect(() => {
		if (isExpanded && status === 'idle') {
			dispatch(fetchPackageHistory({ simId }));
		}
	}, [isExpanded, status, simId, dispatch]);

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
	const statusClass = getStatusClass(item.status);

	const dataText = item.isUnlimited
		? 'Unlimited'
		: item.totalDataMB
		? `${item.remainingDataMB ?? 0} / ${item.totalDataMB} MB`
		: null;

	const voiceText =
		item.totalVoice !== null && item.totalVoice !== undefined
			? `${item.remainingVoice ?? 0} / ${item.totalVoice} min`
			: null;

	const textText =
		item.totalText !== null && item.totalText !== undefined
			? `${item.remainingText ?? 0} / ${item.totalText} SMS`
			: null;

	const expiryText = item.expiresAt
		? new Date(item.expiresAt).toLocaleDateString()
		: null;

	const activatedText = item.activatedAt
		? new Date(item.activatedAt).toLocaleDateString()
		: null;

	return (
		<div className={styles.historyCard}>
			<div className={styles.cardHeader}>
				{item.name && (
					<span className={styles.itemName}>{item.name}</span>
				)}
				<span className={`${styles.statusChip} ${statusClass}`}>
					{capitalizeFirstLetter(
						item.status === SimStatus.NOT_ACTIVE
							? 'in active'
							: item.status
					)}
				</span>
			</div>
			{(item.price || item.currency) && (
				<div className={styles.cardRow}>
					<span className={styles.label}>Price</span>
					<span className={styles.value}>
						{item.price} {item.currency}
					</span>
				</div>
			)}
			{dataText && (
				<div className={styles.cardRow}>
					<span className={styles.label}>Data</span>
					<span className={styles.value}>{dataText}</span>
				</div>
			)}
			{voiceText && (
				<div className={styles.cardRow}>
					<span className={styles.label}>Voice</span>
					<span className={styles.value}>{voiceText}</span>
				</div>
			)}
			{textText && (
				<div className={styles.cardRow}>
					<span className={styles.label}>SMS</span>
					<span className={styles.value}>{textText}</span>
				</div>
			)}
			{item.validityDays && (
				<div className={styles.cardRow}>
					<span className={styles.label}>Validity</span>
					<span className={styles.value}>
						{item.validityDays} days
					</span>
				</div>
			)}
			{activatedText && (
				<div className={styles.cardRow}>
					<span className={styles.label}>Activated</span>
					<span className={styles.value}>{activatedText}</span>
				</div>
			)}
			{expiryText && (
				<div className={styles.cardRow}>
					<span className={styles.label}>Expires</span>
					<span className={styles.value}>{expiryText}</span>
				</div>
			)}
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
