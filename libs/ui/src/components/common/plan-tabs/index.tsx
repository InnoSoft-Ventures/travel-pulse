'use client';

import React, { useEffect, useState } from 'react';
import styles from './plan-tabs.module.scss';
import { UIPlanTabs } from '@travelpulse/interfaces';

const tabs = ['Local Plans', 'Regional Plans', 'Global Plans'] as const;

interface PlanTabsProps {
	activePlan?: UIPlanTabs;
	onChange?: (plan: UIPlanTabs) => void;
}

export function PlanTabs({
	activePlan = UIPlanTabs.Local,
	onChange,
}: PlanTabsProps) {
	const [activeIndex, setActiveIndex] = useState(activePlan);

	useEffect(() => {
		setActiveIndex(activePlan);
	}, [activePlan]);

	const handleClick = (index: number) => {
		setActiveIndex(index);
		onChange?.(index);
	};

	return (
		<div className={styles.planTabsWrapper}>
			<div className={styles.tabs}>
				<div
					className={styles.indicator}
					style={{
						left: `${(100 / tabs.length) * activeIndex}%`,
						width: `${100 / tabs.length}%`,
					}}
				/>
				{tabs.map((tab, index) => (
					<button
						key={tab}
						className={`${styles.tab} ${
							activeIndex === index ? styles.active : ''
						}`}
						onClick={() => handleClick(index)}
					>
						{tab}
					</button>
				))}
			</div>
		</div>
	);
}
