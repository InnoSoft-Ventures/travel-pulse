import React, { memo, useMemo } from 'react';
import styles from './styles.module.scss';
import { SIMDetails } from '@travelpulse/interfaces';
import { formatDataSize } from '@travelpulse/utils';

interface UsageChartProps {
	sim: SIMDetails;
}

function SimUsageComponent({ sim }: UsageChartProps) {
	// Memoize expensive calculations
	const usageData = useMemo(() => {
		const total = sim.total ?? 0;
		const remaining = sim.remaining ?? 0;
		const used = Math.max(0, total - remaining);
		const percentUsed =
			total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
		const percentRemaining = 100 - percentUsed;

		return {
			dataLeft: `${formatDataSize(remaining)} / ${formatDataSize(total)}`,
			used,
			percentUsed,
			percentRemaining,
		};
	}, [sim.total, sim.remaining]);

	const { dataLeft, used, percentUsed, percentRemaining } = usageData;

	return (
		<section className={styles.usageSection}>
			<h2 className={styles.sectionTitle}>Usage</h2>
			{/* <UsageChart data={sim.usageHistory} /> */}
			<div className={styles.kvRow}>
				<span>Remaining / Total</span>
				<span>{dataLeft}</span>
			</div>
			<div className={styles.kvRow}>
				<span>Used</span>
				<span>{formatDataSize(used)}</span>
			</div>
			<div className={styles.progressWrap} aria-label="Usage progress">
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
	);
}

// Memoize component to prevent unnecessary re-renders
export default memo(SimUsageComponent, (prevProps, nextProps) => {
	return (
		prevProps.sim.remaining === nextProps.sim.remaining &&
		prevProps.sim.total === nextProps.sim.total
	);
});
