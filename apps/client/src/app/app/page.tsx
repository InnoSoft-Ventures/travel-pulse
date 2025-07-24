import React from 'react';
import {
	DataUsageChart,
	MyESims,
	NotificationsCard,
	Title,
	UsageStats,
} from '@travelpulse/ui';
import styles from './styles.module.scss';

export const metadata = {
	title: 'Dashboard',
};

const sample = [
	{ month: 'Jan', value: 4 },
	{ month: 'Feb', value: 3 },
	{ month: 'Mar', value: 5 },
	{ month: 'Apr', value: 6 },
	{ month: 'May', value: 4.5 },
	{ month: 'Jun', value: 5.5 },
	{ month: 'Jul', value: 8 },
];

const DashboardPage = () => {
	return (
		<div className={styles.dashboardPage}>
			<div className={styles.dashboardContainer}>
				<div className={styles.dashboardLeftContainer}>
					<div className={styles.dataUsageChartContainer}>
						<Title
							size="size19"
							className={styles.dataUsageChartTitle}
						>
							Data Usage Over Time
						</Title>
						<DataUsageChart
							data={sample}
							strokeColor="#9B87F5"
							gradientId="dataUsageGrad"
							gradientStart="#9B87F5"
							gradientEnd="#FFFFFF"
						/>
					</div>

					<MyESims
						sims={[
							{
								id: 'sim1',
								planName: 'Primary eSIM',
								providerName: 'Global connect',
								phoneNumber: '(+27) 60 320 7047',
								dataLeft: '10 GB',
								expiresOn: 'May 18, 2025',
								isActive: true,
							},
							{
								id: 'sim2',
								planName: 'Travel eSIM (US)',
								providerName: 'TravelSIM',
								phoneNumber: '(+27) 60 320 7047',
								dataLeft: '5 GB',
								expiresOn: 'Jun 21, 2025',
								isActive: false,
							},
						]}
					/>
				</div>
				<div className={styles.dashboardRightContainer}>
					<div>
						<UsageStats />
						<NotificationsCard />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
