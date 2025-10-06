'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrderById, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { Modal, Title, Button } from '@travelpulse/ui';
import styles from '../../styles.module.scss';

export default function OrderModalPage() {
	const params = useParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const orderId = Number(params?.orderId);
	const { list } = useAppSelector((s) => s.account.orders);
	const [isFetching, setIsFetching] = useState(false);
	const [tried, setTried] = useState(false);
	const [isPaying, setIsPaying] = useState(false);

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

	const onClose = () => router.back();

	const isLoading = !order && (isFetching || !tried);
	const notFound = !order && tried && !isFetching;

	const isUnpaid = (status?: string) => {
		const s = String(status).toUpperCase();
		return s === 'PENDING' || s === 'PROCESSING_PAYMENT';
	};

	const handlePayNow = async () => {
		if (!order) return;
		try {
			setIsPaying(true);
			const attempt = await (dispatch as any)(
				createPaymentAttempt({
					orderId: order.orderId,
					provider: 'paystack',
					method: 'card',
					currency: order.currency,
				})
			).unwrap();
			// If you want to launch a provider immediately, import and call:
			// import { launchPaymentProvider } from '@travelpulse/ui/payment-launcher';
			// launchPaymentProvider(attempt, dispatch as any);
		} catch (e) {
			console.error('Failed to start payment:', e);
		} finally {
			setIsPaying(false);
		}
	};

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
						{isUnpaid(String(order.status)) && (
							<Button
								fullWidth
								isLoading={isPaying}
								onClick={handlePayNow}
							>
								Pay now
							</Button>
						)}
						<Button
							as={Link as any}
							href={`/app/settings/orders/${order.orderId}`}
							target="_blank"
							rel="noopener noreferrer"
							variant="outline"
						>
							Open full page
						</Button>
						<Button variant="outline" onClick={onClose}>
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
