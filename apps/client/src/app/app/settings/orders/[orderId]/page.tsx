'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrderById, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { Button, Title } from '@travelpulse/ui';
import { dateJs } from '@travelpulse/utils';
import styles from './style.module.scss';

type Line = {
	id: string | number;
	packageId: number;
	simId?: number | null;
	name?: string;
	dataSize?: string;
	validityDays?: number;
	quantity: number;
	retail: number;
	price: number;
	status?: string;
};

const STATUS_INTENT: Record<
	string,
	'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
	COMPLETED: 'success',
	PAID: 'success',
	PENDING: 'warning',
	PROCESSING_PAYMENT: 'info',
	PROCESSING: 'info',
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

const money = (n: number, ccy: string) => `${Number(n ?? 0).toFixed(2)} ${ccy}`;

export default function OrderDetailsPage() {
	const { orderId: idParam } = useParams<{ orderId: string }>();
	const orderId = Number(idParam);
	const dispatch = useAppDispatch();

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

	const isLoading = !order && (isFetching || !tried);
	const notFound = !order && tried && !isFetching;

	const createdAtFmt = useMemo(
		() => (order?.formattedCreatedAt ? order.formattedCreatedAt : '—'),
		[order?.formattedCreatedAt]
	);

	const lines: Line[] = useMemo(() => {
		if (!order?.details?.length) return [];
		return order.details.map((d: any) => ({
			id: d.id ?? d.packageId ?? `${order.orderId}-${Math.random()}`,
			packageId: Number(d.packageId),
			simId: d.sim?.id ?? null,
			name: d.sim?.name ?? `Package #${d.packageId}`,
			dataSize: d.dataSize ?? (d.dataGb ? `${d.dataGb} GB` : undefined),
			validityDays:
				Number(d.validityDays ?? d.validity ?? 0) || undefined,
			quantity: Number(d.quantity ?? 1),
			retail: Number(d.retail ?? d.msrp ?? d.price ?? 0),
			price: Number(d.price ?? 0),
			status: d.status,
		}));
	}, [order?.details, order?.orderId]);

	const totals = useMemo(() => {
		const qty = lines.reduce((s, l) => s + l.quantity, 0);
		const rvl = lines.reduce((s, l) => s + l.retail * l.quantity, 0);
		const paid = lines.reduce((s, l) => s + l.price * l.quantity, 0);
		const total = Number(order?.totalAmount);
		return { qty, rvl, total, paid };
	}, [lines, order?.totalAmount]);

	const intent = useMemo(
		() =>
			STATUS_INTENT[String(order?.status ?? '').toUpperCase()] ??
			'neutral',
		[order?.status]
	);

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

	if (isLoading) return <div className={styles.skeleton} />;
	if (notFound || !order) return <Title size="size16">Order not found</Title>;

	const showPay = ['PENDING', 'PROCESSING_PAYMENT'].includes(
		String(order.status).toUpperCase()
	);

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<Title size="size19">Order details</Title>
					<Button
						as={Link as any}
						href="/app/settings/orders"
						variant="outline"
						size="sm"
					>
						← Back to list
					</Button>
				</div>
				<div className={styles.headerActions}>
					{showPay && (
						<Button
							size="sm"
							isLoading={isPaying}
							onClick={handlePayNow}
						>
							Pay now
						</Button>
					)}
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
			</header>

			{/* Combined Summary */}
			<section className={styles.summaryCombined}>
				<div className={styles.summaryLeft}>
					<div className={styles.orderNoRow}>
						<Title size="size16">
							Order #{' '}
							<span className={styles.orderNo}>
								{order.orderNumber}
							</span>
						</Title>
						<span className={`${styles.badge} ${styles[intent]}`}>
							{human(order.status)}
						</span>
					</div>
					<div className={styles.hDivider} />
					<div className={styles.kvlContainer}>
						<div className={styles.kvlLeft}>
							<span className={styles.k}>Order date</span>
							<span className={styles.v}>{createdAtFmt}</span>
						</div>
						<div className={styles.kvlLeft}>
							<span className={styles.k}>Total quantity</span>
							<span className={styles.v}>
								{totals.qty} eSIM{totals.qty === 1 ? '' : 's'}
							</span>
						</div>
					</div>
				</div>

				<div className={styles.summaryRight}>
					<div className={styles.kvlRight}>
						<span className={styles.kStrong}>Order total</span>
						<span className={styles.vStrongRight}>
							{money(totals.total, order.currency)}
						</span>
					</div>
				</div>
			</section>

			{/* Table */}
			<section className={styles.tableCard}>
				<div className={styles.tableHeader}>
					<div>Plan</div>
					<div>Type</div>
					<div>Qty</div>
					<div>Retail value</div>
					<div>Price</div>
					<div>Status</div>
					<div>Actions</div>
				</div>
				<div className={styles.hrLight} />
				{lines.map((l) => (
					<div key={l.id} className={styles.row}>
						<div className={styles.tdPlan}>
							{l.simId ? (
								<Link
									href={`/app/esims/${l.simId}`}
									className={styles.planLink}
								>
									{l.name}
								</Link>
							) : (
								<span className={styles.planLink}>
									{l.name}
								</span>
							)}
							{l.dataSize && (
								<div className={styles.planSub}>
									{l.dataSize} • {l.validityDays || 0} Days
								</div>
							)}
						</div>
						<div>eSIM</div>
						<div>{l.quantity}</div>
						<div className={styles.tdRight}>
							{money(l.retail, order.currency)}
						</div>
						<div className={styles.tdRight}>
							{money(l.price, order.currency)}
						</div>
						<div>
							<span
								className={`${styles.badge} ${styles[intent]}`}
							>
								{human(l.status ?? order.status)}
							</span>
						</div>
						<div className={styles.tdActions}>
							{l.simId ? (
								<Button
									size="sm"
									variant="outline"
									as={Link as any}
									href={`/app/esims/${l.simId}`}
								>
									View eSIM
								</Button>
							) : (
								<Button size="sm" variant="outline" isDisabled>
									View eSIM
								</Button>
							)}
						</div>
					</div>
				))}
			</section>

			{/* Timeline */}
			<section className={styles.timelineCard}>
				<Title size="size16" className={styles.timelineHeader}>
					Timeline
				</Title>
				<ol className={styles.timeline}>
					{timeline.map((t, i) => (
						<li key={i} className={styles.timelineItem}>
							<span className={styles.timelineBullet} />
							<div className={styles.timelineBody}>
								<div className={styles.timelineTitle}>
									{t.message}
								</div>
								{t.description && (
									<div className={styles.timelineSub}>
										{t.description}
									</div>
								)}
								{t.datetime && (
									<div className={styles.timelineAt}>
										{t.datetime}
									</div>
								)}
							</div>
						</li>
					))}
				</ol>

				{nextStepMsg && (
					<div className={styles.nextStep}>
						<strong>Next step:</strong> {nextStepMsg}
					</div>
				)}
			</section>
		</div>
	);
}
