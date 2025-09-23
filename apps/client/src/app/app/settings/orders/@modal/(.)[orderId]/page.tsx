'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrderById } from '@travelpulse/ui/thunks';
import { Modal, Title, Button } from '@travelpulse/ui';
import styles from '../../styles.module.scss';

export default function OrderModalPage() {
	const params = useParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const orderId = Number(params?.orderId);
	const { list } = useAppSelector((s) => s.account.orders);

	const order = useMemo(
		() => list.list.find((o) => o.orderId === orderId) || null,
		[list.list, orderId]
	);

	useEffect(() => {
		if (!order && Number.isFinite(orderId)) {
			dispatch(fetchOrderById(orderId));
		}
	}, [order, orderId, dispatch]);

	const onClose = () => router.back();

	const isLoading = !order && list.status === 'loading';
	const notFound = !order && list.status === 'succeeded';

	return (
		<Modal open={true} onClose={onClose} size="medium" center>
			{order ? (
				<div className={styles.detailsModal}>
					<div className={styles.detailsHeader}>
						<Title size="size16">
							Order #{order.orderNumber || order.orderId}
						</Title>
					</div>
					<div className={styles.detailsMeta}>
						<div>
							Date:{' '}
							{new Date(
								order.createdAt as unknown as string
							).toLocaleString()}
						</div>
						<div>
							Total: {order.totalAmount} {order.currency}
						</div>
					</div>
					<div className={styles.itemsList}>
						{order.details?.map((d) => (
							<div key={d.id} className={styles.itemRow}>
								<div>Package #{d.packageId}</div>
								<div>Qty: {d.quantity}</div>
								<div>Price: {d.price}</div>
								<div>Start: {d.startDate}</div>
							</div>
						))}
					</div>
					<div className={styles.modalActions}>
						<Button fullWidth onClick={onClose}>
							Close
						</Button>
					</div>
				</div>
			) : isLoading ? (
				<div className={styles.detailsModal}>
					<div className={styles.detailsHeader}>
						<Title size="size16">Loading order…</Title>
					</div>
				</div>
			) : notFound ? (
				<div className={styles.detailsModal}>
					<div className={styles.detailsHeader}>
						<Title size="size16">Order not found</Title>
					</div>
					<div className={styles.modalActions}>
						<Button
							fullWidth
							onClick={() => router.push('/app/settings/orders')}
						>
							Back to Orders
						</Button>
					</div>
				</div>
			) : null}
		</Modal>
	);
}
