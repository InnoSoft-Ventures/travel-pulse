import React from 'react';
import styles from './styles.module.scss';

interface NotificationItem {
	message: string;
	timestamp: string;
}

const notifications: NotificationItem[] = [
	{
		message:
			'You have used 90% of your data on your TravelSIM. Please top up soon to avoid with interruptions.',
		timestamp: 'Just now',
	},
	{
		message: 'Your current eSIM plan MTN 5GB will expire soon...',
		timestamp: '13 minutes ago',
	},
	{
		message: 'Your eSIM profile for MTN Global Roaming has been updated...',
		timestamp: '2 hours ago',
	},
	{
		message: 'Try the new Global Nomad 2GB plan at 25% off...',
		timestamp: '2 hours ago',
	},
];

export const NotificationsCard = () => {
	return (
		<div className={styles.notificationsCard}>
			<h2>Notifications</h2>
			{notifications.map((n, index) => (
				<div
					key={`notification-item-${index}`}
					className={styles.notificationItem}
				>
					<div
						title={n.message}
						className={styles.notificationMessage}
					>
						{n.message}
					</div>
					<div className={styles.notificationTimestamp}>
						{n.timestamp}
					</div>
					{index < notifications.length - 1 && (
						<hr className="my-3 border-t border-gray-200" />
					)}
				</div>
			))}
		</div>
	);
};
