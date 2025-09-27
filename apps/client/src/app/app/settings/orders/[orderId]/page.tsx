'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrderById } from '@travelpulse/ui/thunks';
import { Button, Title } from '@travelpulse/ui';
import styles from '../styles.module.scss';

export default function OrderDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const orderId = Number(params?.orderId);
	const { list } = useAppSelector((s) => s.account.orders);
	const [isFetching, setIsFetching] = useState(false);
	const [tried, setTried] = useState(false);

	const order = useMemo(
		() => list.list.find((o) => o.orderId === orderId) || null,
		[list.list, orderId]
	);

	useEffect(() => {
		let active = true;
		if (!order && Number.isFinite(orderId)) {
			setIsFetching(true);
			dispatch(fetchOrderById(orderId))
				.unwrap()
				.catch(() => {})
				.finally(() => {
					if (!active) return;
					setIsFetching(false);
					setTried(true);
				});
		}
		return () => {
			active = false;
		};
	}, [order, orderId, dispatch]);

	const goBack = () => router.push('/app/settings/orders');

	const isLoading = !order && (isFetching || !tried);
	const notFound = !order && tried && !isFetching;

	return (
		<div className={styles.container}>
			{!order ? (
				isLoading ? (
					<div className={styles.detailsHeader}>
						<Title size="size16">Loading order…</Title>
					</div>
				) : notFound ? (
					<div className={styles.detailsModal}>
						<div className={styles.detailsHeader}>
							<Title size="size16">Order not found</Title>
						</div>
						<div className={styles.modalActions}>
							<Button
								variant="outline"
								onClick={() =>
									router.push('/app/settings/orders')
								}
							>
								Back to Orders
							</Button>
						</div>
					</div>
				) : null
			) : (
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
				</div>
			)}
			<div className={styles.modalActions}>
				<Button variant="outline" onClick={goBack}>
					Back to Orders
				</Button>
			</div>
		</div>
	);
}
