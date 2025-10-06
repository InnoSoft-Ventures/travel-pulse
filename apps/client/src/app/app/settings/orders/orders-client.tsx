'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrders, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { Title, Button } from '@travelpulse/ui';
import styles from './styles.module.scss';
import { DateRange, dateJs } from '@travelpulse/utils';
import OrderDetailHeader from './order-detail-header';
import OrderItemRow from './order-item-row';

export default function OrdersClient() {
	const dispatch = useAppDispatch();
	const { list } = useAppSelector((s) => s.account.orders);

	const [statusFilter, setStatusFilter] = useState<
		'all' | 'unpaid' | 'processing' | 'paid' | 'failed'
	>('all');
	const [query, setQuery] = useState('');
	const [dates, setDates] = useState<DateRange>({
		startDate: dateJs(),
		endDate: dateJs(),
	});
	const [dateFilterOn, setDateFilterOn] = useState(false);

	useEffect(() => {
		if (list.status === 'idle' || list.status === 'failed') {
			dispatch(fetchOrders());
		}
	}, [dispatch, list.status]);

	const filtered = useMemo(() => {
		let rows = list.list;
		if (statusFilter !== 'all') {
			rows = rows.filter((o) => {
				const status = String(o.status).toUpperCase();
				if (statusFilter === 'unpaid') return status === 'PENDING';
				if (statusFilter === 'processing')
					return status === 'PROCESSING_PAYMENT';
				if (statusFilter === 'paid')
					return status === 'PAID' || status === 'COMPLETED';
				if (statusFilter === 'failed')
					return (
						status === 'PAYMENT_FAILED' || status === 'CANCELLED'
					);
				return true;
			});
		}
		const q = query.trim().toLowerCase();
		if (q) {
			rows = rows.filter(
				(o) =>
					String(o.orderNumber).toLowerCase().includes(q) ||
					String(o.orderId).toLowerCase().includes(q)
			);
		}
		if (dateFilterOn && dates.startDate && dates.endDate) {
			const start = dates.startDate.startOf('day').toDate().getTime();
			const end = dates.endDate.endOf('day').toDate().getTime();
			rows = rows.filter((o) => {
				const t = new Date(o.createdAt as unknown as string).getTime();
				return t >= start && t <= end;
			});
		}
		return rows;
	}, [list.list, statusFilter, query, dates, dateFilterOn]);

	const isUnpaid = (status?: string) => {
		const s = String(status).toUpperCase();
		return s === 'PENDING' || s === 'PROCESSING_PAYMENT';
	};

	const handlePayNow = async (orderId: number) => {
		try {
			const order = filtered.find((o) => o.orderId === orderId);
			if (!order) return;
			await (dispatch as any)(
				createPaymentAttempt({
					orderId,
					provider: 'paystack',
					method: 'card',
					currency: order.currency,
				})
			).unwrap();
			// launchPaymentProvider(attempt, dispatch as any);
		} catch (e) {
			console.error('Failed to start payment:', e);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.headerRow}>
				<Title size="size19" className={styles.title}>
					Your Orders
				</Title>
				<OrderDetailHeader
					dateFilterOn={dateFilterOn}
					setDateFilterOn={setDateFilterOn}
					dates={dates}
					setDates={setDates}
					query={query}
					setQuery={setQuery}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
				/>
			</div>

			{list.status === 'loading' && (
				<div className={styles.loading}>Loading orders…</div>
			)}
			{list.status === 'failed' && (
				<div className={styles.error}>
					Could not load orders. Please try again.
				</div>
			)}
			{list.status === 'succeeded' && filtered.length === 0 && (
				<div className={styles.empty}>No orders to display.</div>
			)}

			{filtered.length > 0 && (
				<div className={styles.table}>
					<div className={styles.tableHeader}>
						<div>Order #</div>
						<div>Date</div>
						<div>Payment</div>
						<div>Status</div>
						<div>Price</div>
					</div>
					{filtered.map((order) => (
						<OrderItemRow
							key={order.orderId}
							order={order}
							isUnpaid={isUnpaid(String(order.status))}
							handlePayNow={handlePayNow}
						/>
					))}
				</div>
			)}
		</div>
	);
}
