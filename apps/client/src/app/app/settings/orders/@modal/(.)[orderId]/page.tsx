'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrderById, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { Title, Button } from '@travelpulse/ui';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
} from '@heroui/drawer';
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
		<Drawer
			isOpen={true}
			onOpenChange={(open) => !open && onClose()}
			size="lg"
			placement="right"
		>
			<DrawerContent>
				{(close) => (
					<>
						<DrawerHeader>
							{order ? (
								<span>
									Order #{order.orderNumber || order.orderId}
								</span>
							) : isLoading ? (
								<Title size="size16">
									Loading order details
								</Title>
							) : notFound ? (
								<Title size="size16">Order not found</Title>
							) : null}
						</DrawerHeader>
						<DrawerBody>
							{order && (
								<div className={styles.drawerContent}>
									<div className={styles.detailsMeta}>
										<div>
											Date:{' '}
											{new Date(
												order.createdAt as unknown as string
											).toLocaleString()}
										</div>
										<div>
											Total: {order.totalAmount}{' '}
											{order.currency}
										</div>
									</div>
									<div className={styles.itemsList}>
										{order.details?.map((d) => (
											<div
												key={d.id}
												className={styles.itemRow}
											>
												<div>
													Package #{d.packageId}
												</div>
												<div>Qty: {d.quantity}</div>
												<div>Price: {d.price}</div>
												<div>Start: {d.startDate}</div>
											</div>
										))}
									</div>
								</div>
							)}
							{isLoading && (
								<div
									className={styles.skeletonWrapper}
									aria-label="Loading order details"
								>
									<div className={styles.skeletonRow}>
										<div
											className={`${styles.skeletonBlock} ${styles.md}`}
										></div>
										<div
											className={`${styles.skeletonBlock} ${styles.sm}`}
										></div>
									</div>
									<div
										className={
											styles.skeletonBlock +
											' ' +
											styles.lg
										}
									></div>
									<div
										className={
											styles.skeletonBlock +
											' ' +
											styles.tall
										}
									></div>
								</div>
							)}
							{notFound && (
								<div className={styles.detailsModal}>
									<div className={styles.detailsHeader}>
										<Title size="size16">
											Order not found
										</Title>
									</div>
								</div>
							)}
						</DrawerBody>
						<DrawerFooter>
							{order && isUnpaid(String(order.status)) && (
								<Button
									fullWidth
									isLoading={isPaying}
									onClick={handlePayNow}
								>
									Pay now
								</Button>
							)}
							{order && (
								<Button
									as={Link as any}
									href={`/app/settings/orders/${order.orderId}`}
									target="_blank"
									rel="noopener noreferrer"
									variant="outline"
								>
									Open full page
								</Button>
							)}
							<Button
								variant="outline"
								onClick={() => {
									close();
									onClose();
								}}
							>
								Close
							</Button>
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
}
