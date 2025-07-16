'use client';

import { useEffect, useRef, useState } from 'react';
import { DatePicker, PlanCard } from '@travelpulse/ui';
import styles from './country.module.scss';
import { ApiService, updateDates, useAppDispatch } from '@travelpulse/ui/state';
import { DATE_FORMAT, dateJs, DateRange } from '@travelpulse/utils';
import {
	PackageInterface,
	PackageResults,
	SuccessResponse,
	UIPlanType,
	UIPlanTypeMap,
} from '@travelpulse/interfaces';

interface PlanListProps {
	slug: string;
	targetDestination: UIPlanType;
	startDate: dateJs.Dayjs;
	endDate: dateJs.Dayjs;
	handlePlanDetails: (plan: PackageInterface) => void;
}

export default function PlanList({
	slug,
	handlePlanDetails,
	startDate,
	endDate,
	targetDestination,
}: PlanListProps) {
	const dispatch = useAppDispatch();

	const [plans, setPlans] = useState<PackageResults | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;
		setLoading(true);
		setError(null);
		console.log(
			'Fetching plans for:',
			slug,
			UIPlanTypeMap[targetDestination]
		);

		ApiService.get('/products/search', {
			params: {
				query: slug,
				targetDestination: UIPlanTypeMap[targetDestination],
				from: startDate.format(DATE_FORMAT),
				to: endDate.format(DATE_FORMAT),
			},
		})
			.then((res) => {
				if (!isMountedRef.current) return;
				const parsed = res.data as SuccessResponse<PackageResults>;
				setPlans(parsed.data);
			})
			.catch((err) => {
				console.error('Error fetching plans:', err);
				if (isMountedRef.current) setError('Failed to load plans.');
			})
			.finally(() => {
				if (isMountedRef.current) setLoading(false);
			});

		return () => {
			isMountedRef.current = false;
		};
	}, [
		slug,
		startDate.toISOString(),
		targetDestination,
		endDate.toISOString(),
	]);

	const handleDateChange = (range: DateRange) => {
		dispatch(
			updateDates({
				start: range.startDate.toISOString(),
				end: range.endDate.toISOString(),
			})
		);
	};

	return (
		<>
			<div className={styles.searchBox}>
				<DatePicker
					dates={{
						startDate: startDate,
						endDate: endDate,
					}}
					setDates={handleDateChange}
					hideSearchBtn
				/>
			</div>

			{loading ? (
				<div className={styles.planState}>Loading plans...</div>
			) : !plans?.packages?.length ? (
				<div className={styles.planState}>
					No plans available right now.
				</div>
			) : (
				<div className={styles.plansContainer}>
					<div className={styles.plans}>
						{plans.packages.map((plan) => (
							<PlanCard
								key={`package-${plan.packageId}`}
								packageDetails={plan}
								showPlanDetails={() => handlePlanDetails(plan)}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}
