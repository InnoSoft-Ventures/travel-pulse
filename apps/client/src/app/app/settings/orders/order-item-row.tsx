import React from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';
import { Button } from '@travelpulse/ui';
import { OrderDetailResponse } from '@travelpulse/interfaces';

function StatusBadge({ status }: { status?: string }) {
	const s = (status || '').toUpperCase();
	if (['PAID', 'COMPLETED'].includes(s))
		return <span className={styles.badgeSuccess}>Paid</span>;
	if (['PROCESSING_PAYMENT'].includes(s))
		return <span className={styles.badgeWarn}>Processing</span>;
	if (['PENDING'].includes(s))
		return <span className={styles.badgeNeutral}>Unpaid</span>;
	if (['PAYMENT_FAILED', 'CANCELLED'].includes(s))
		return <span className={styles.badgeDanger}>Failed</span>;
	return <span className={styles.badgeNeutral}>{status ?? '—'}</span>;
}

interface OrderItemRowProps {
	order: OrderDetailResponse;
	isUnpaid: boolean;
	handlePayNow: (orderId: number) => Promise<void>;
}

function OrderItemRow({ order, isUnpaid, handlePayNow }: OrderItemRowProps) {
	const paymentStatus = String(order.status).toUpperCase();
	const processingStatus = paymentStatus; // placeholder for separate processing status if added later

	return (
		<div className={styles.tableRow}>
			<Link
				className={styles.rowDetails}
				href={`orders/${order.orderId}`}
			>
				<div className={styles.orderNumber}>
					#{order.orderNumber || order.orderId}
				</div>
				<div>{order.formattedCreatedAt}</div>
				<div>
					<StatusBadge status={paymentStatus} />
				</div>
				<div>
					<StatusBadge status={processingStatus} />
				</div>
				<div>
					{order.totalAmount} {order.currency}
				</div>
			</Link>
			<div className={styles.rowActions}>
				{isUnpaid ? (
					<Button
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							handlePayNow(order.orderId);
						}}
					>
						Pay now
					</Button>
				) : (
					<Button
						variant="outline"
						size="sm"
						as={Link as any}
						href={`orders/${order.orderId}`}
						onClick={(e) => e.stopPropagation()}
					>
						View details
					</Button>
				)}
			</div>
		</div>
	);
}

export default OrderItemRow;
