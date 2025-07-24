'use client';
import React from 'react';
import { UsageStatCard } from '../usage-stat-card';
import { UsageStatChart } from '../usage-stat-chart';
import styles from './styles.module.scss';
import { cn } from '../../../utils';

// icons
import DailyUsageIcon from '../../../assets/graph.svg';
import TotalUsageIcon from '../../../assets/usage-pulse.svg';

const dummyData = [
	{ index: 0, value: 2 },
	{ index: 1, value: 3 },
	{ index: 2, value: 1 },
	{ index: 3, value: 4 },
	{ index: 4, value: 2.5 },
	{ index: 5, value: 3.5 },
	{ index: 6, value: 2 },
];

interface UsageStatsProps {
	direction?: 'horizontal' | 'vertical';
}

export const UsageStats = ({ direction = 'vertical' }: UsageStatsProps) => {
	return (
		<div className={cn(styles.usageStatsContainer, styles[direction])}>
			<UsageStatCard
				title="Total Data Usage"
				value="34.2 GB"
				description="Across all recent eSIMs"
				trend="12% from last month"
				trendType="positive"
				graph={
					<UsageStatChart
						data={dummyData}
						strokeColor="#9B87F5"
						fillConfig={{ type: 'solid', fillColor: '#EBE6FD' }}
					/>
				}
				icon={<TotalUsageIcon />}
			/>

			<UsageStatCard
				title="Average Daily Usage"
				value="1.2 GB"
				description="Across all active eSIMs"
				trend="5% from last week"
				trendType="negative"
				graph={
					<UsageStatChart
						data={dummyData}
						strokeColor="#C82E63"
						fillConfig={{
							type: 'solid',
							fillColor: 'rgba(200,46,99,0.15)',
						}}
					/>
				}
				icon={<DailyUsageIcon />}
			/>
		</div>
	);
};
