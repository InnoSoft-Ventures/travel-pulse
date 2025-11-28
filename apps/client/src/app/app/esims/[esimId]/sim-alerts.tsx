import React, { memo, useMemo } from 'react';
import styles from './styles.module.scss';
import { SIMDetails } from '@travelpulse/interfaces';

interface SimAlertProps {
	sim: SIMDetails;
}

function SimAlertComponent({ sim }: SimAlertProps) {
	// Memoize alert calculations
	const alertData = useMemo(() => {
		const total = sim.total ?? 0;
		const remaining = sim.remaining ?? 0;
		const expiresOn = sim.expiredAt;
		const expiresDate = expiresOn ? new Date(expiresOn) : null;
		const daysToExpiry = expiresDate
			? Math.ceil(
					(expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
			  )
			: null;
		const isLowData = total > 0 && remaining / total <= 0.1;
		const isExpiringSoon = daysToExpiry !== null && daysToExpiry <= 3;

		return { isLowData, isExpiringSoon, daysToExpiry };
	}, [sim.total, sim.remaining, sim.expiredAt]);

	const { isLowData, isExpiringSoon, daysToExpiry } = alertData;

	return (
		<>
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
		</>
	);
}

// Memoize to prevent re-renders
export default memo(SimAlertComponent, (prevProps, nextProps) => {
	return (
		prevProps.sim.total === nextProps.sim.total &&
		prevProps.sim.remaining === nextProps.sim.remaining &&
		prevProps.sim.expiredAt === nextProps.sim.expiredAt
	);
});
