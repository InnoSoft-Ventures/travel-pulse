'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
import { dateJs } from '@travelpulse/utils';
import styles from './styles.module.scss';

const STATUS_INTENT: Record<
	string,
	'warning' | 'success' | 'info' | 'danger' | 'neutral'
> = {
	PROCESSING: 'info',
	PROCESSING_PAYMENT: 'info',
	PENDING: 'warning',
	PAID: 'success',
	COMPLETED: 'success',
	PAYMENT_FAILED: 'danger',
	CANCELLED: 'danger',
};

const human = (s?: string) => {
	const up = String(s ?? '').toUpperCase();
	switch (up) {
		case 'PROCESSING_PAYMENT':
		case 'PROCESSING':
			return 'Processing';
		case 'PAYMENT_FAILED':
			return 'Payment failed';
		default:
			return up ? up[0] + up.slice(1).toLowerCase() : '—';
	}
};

const canPay = (status?: string) => {
	const up = String(status ?? '').toUpperCase();
	return up === 'PENDING' || up === 'PROCESSING_PAYMENT';
};

const money = (amount: number, code: string) =>
	`${Number(amount ?? 0).toFixed(2)} ${code || ''}`;

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

	const onClose = useCallback(() => router.back(), [router]);

	const isLoading = !order && (isFetching || !tried);
	const notFound = !order && tried && !isFetching;

	const createdAtFmt = useMemo(
		() =>
			order?.createdAt
				? dateJs(order.createdAt).format('DD MMM YYYY, HH:mm A')
				: '—',
		[order?.createdAt]
	);

	const totalFmt = useMemo(
		() => (order ? money(order.totalAmount, order.currency) : '—'),
		[order]
	);

	const intent = useMemo(
		() =>
			STATUS_INTENT[String(order?.status ?? '').toUpperCase()] ??
			'neutral',
		[order?.status]
	);

	const items = useMemo(() => {
		if (!order?.details?.length) return [];
		return order.details.map((d: any) => ({
			id: d.id ?? d.packageId ?? `${order.orderId}-${Math.random()}`,
			packageId: Number(d.packageId),
			name: d.name ?? `Package #${d.packageId}`,
			quantity: Number(d.quantity ?? 1),
			unitPrice: Number(d.price ?? 0),
			startDate: d.startDate,
		}));
	}, [order?.details, order?.orderId]);

	const timeline = order?.timeline?.events || [];
	const nextStepMsg = order?.timeline?.nextStepMessage || '';

	const handlePayNow = useCallback(async () => {
		if (!order) return;
		try {
			setIsPaying(true);
			await (dispatch as any)(
				createPaymentAttempt({
					orderId: order.orderId,
					provider: 'paystack',
					method: 'card',
					currency: order.currency,
				})
			).unwrap();
		} catch (e) {
			console.error('Failed to start payment:', e);
		} finally {
			setIsPaying(false);
		}
	}, [dispatch, order]);

	return (
		<Drawer
			isOpen
			onOpenChange={(open) => !open && onClose()}
			size="3xl"
			placement="right"
		>
			<DrawerContent>
				{() => (
					<>
						<DrawerHeader className={styles.headerWrap}>
							{order ? (
								<div className={styles.headerBar}>
									<div className={styles.headerLeft}>
										<Title size="size16">
											Order #{' '}
											<span className={styles.orderNo}>
												{order.orderNumber}
											</span>
										</Title>
									</div>
									<div className={styles.headerActions}>
										<Button
											size="sm"
											variant="outline"
											as={Link as any}
											href={`/app/settings/orders/${order.orderId}?print=invoice`}
											target="_blank"
										>
											Invoice
										</Button>
									</div>
								</div>
							) : null}
						</DrawerHeader>

						<DrawerBody>
							{order && (
								<div className={styles.grid}>
									<section className={styles.metaCard}>
										<div className={styles.metaHeader}>
											<Title size="size16">
												Order Summary
											</Title>
											<span
												className={`${styles.statusChip} ${styles[intent]}`}
											>
												{human(order.status)}
											</span>
										</div>
										<div className={styles.metaRowNew}>
											<span>Order date</span>
											<span>{createdAtFmt}</span>
										</div>
										<div className={styles.metaRowNew}>
											<span>Total quantity</span>
											<span>
												{items.length} eSIM
												{items.length === 1 ? '' : 's'}
											</span>
										</div>
										<div className={styles.metaTotalRow}>
											<span>Order total</span>
											<span>{totalFmt}</span>
										</div>
									</section>
									{/* Items */}
									<section className={styles.card}>
										<Title size="size16">Items</Title>
										<ul className={styles.items}>
											{items.map((it) => (
												<li
													key={it.id}
													className={styles.itemRow}
												>
													<div
														className={
															styles.itemInfo
														}
													>
														<div
															className={
																styles.itemPrimary
															}
														>
															<span
																className={
																	styles.itemName
																}
															>
																{it.name}
															</span>
														</div>
														<div
															className={
																styles.itemSecondary
															}
														>
															<span>
																Qty:{' '}
																{it.quantity}
															</span>
															<span>
																Price:{' '}
																{money(
																	it.unitPrice,
																	order.currency
																)}
															</span>
															<span>
																Start:{' '}
																{it.startDate ||
																	'—'}
															</span>
														</div>
													</div>
													<div
														className={
															styles.itemActions
														}
													>
														<Button
															as={Link as any}
															size="sm"
															variant="outline"
															href={`/esims/${it.packageId}`}
														>
															View eSIM
														</Button>
													</div>
												</li>
											))}
										</ul>
									</section>

									{/* Timeline */}
									<section className={styles.cardFull}>
										<Title
											size="size16"
											className={styles.timelineHeader}
										>
											Timeline
										</Title>
										<ol className={styles.timeline}>
											{timeline.map((t, i) => (
												<li
													key={`${t.message}-${i}`}
													className={
														styles.timelineItem
													}
												>
													<span
														className={
															styles.timelineBullet
														}
													/>
													<div
														className={
															styles.timelineBody
														}
													>
														<div
															className={
																styles.timelineTitle
															}
														>
															{t.message}
														</div>
														{t.description && (
															<div
																className={
																	styles.timelineSub
																}
															>
																{t.description}
															</div>
														)}
														{t.datetime && (
															<div
																className={
																	styles.timelineAt
																}
															>
																{t.datetime}
															</div>
														)}
													</div>
												</li>
											))}
										</ol>
										{nextStepMsg && (
											<div className={styles.nextStep}>
												<strong>Next step:</strong>{' '}
												{nextStepMsg}
											</div>
										)}
									</section>
								</div>
							)}
						</DrawerBody>

						<DrawerFooter className={styles.footer}>
							<Button
								as={Link as any}
								href={`/app/settings/orders/${orderId}`}
								target="_blank"
								variant="outline"
							>
								Open full page
							</Button>
							<Button variant="outline" onClick={onClose}>
								Close
							</Button>
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
}
