import React from 'react';
import { ActivityLog, ActivityLogEntry, ESimTabs } from '@travelpulse/ui';

const ESimsPage = () => {
	return (
		<div>
			<ESimTabs
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

			<ActivityLog />
		</div>
	);
};

export default ESimsPage;
