'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
} from '@heroui/drawer';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrders, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { Title, Button, DatePicker } from '@travelpulse/ui';
import styles from './styles.module.scss';
import { DateRange, dateJs } from '@travelpulse/utils';

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
	const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
	const activeOrder = useMemo(
		() =>
			activeOrderId != null
				? list.list.find((o) => o.orderId === activeOrderId) || null
				: null,
		[list.list, activeOrderId]
	);

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

	const openDrawer = useCallback((id: number) => setActiveOrderId(id), []);
	const closeDrawer = useCallback(() => setActiveOrderId(null), []);
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
				<Title size="size20">Your Orders</Title>
				<div className={styles.filters}>
					<input
						className={styles.search}
						placeholder="Search by order #"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<div className={styles.dateFilter}>
						<DatePicker
							hideSearchBtn
							dates={dates}
							setDates={(d) => {
								setDates(d);
								setDateFilterOn(true);
							}}
						/>
						{dateFilterOn && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDateFilterOn(false)}
							>
								Clear date
							</Button>
						)}
					</div>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as any)}
					>
						<option value="all">All</option>
						<option value="unpaid">Unpaid</option>
						<option value="processing">Processing</option>
						<option value="paid">Paid</option>
						<option value="failed">Failed</option>
					</select>
				</div>
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
					{filtered.map((o) => {
						const paymentStatus = String(o.status).toUpperCase();
						const processingStatus = paymentStatus; // placeholder for separate processing status if added later
						return (
							<div key={o.orderId} className={styles.tableRow}>
								<Link
									key={o.orderId}
									className={styles.rowDetails}
									href={`orders/${o.orderId}`}
									// onClick={() => openDrawer(o.orderId)}
								>
									<div className={styles.orderNumber}>
										#{o.orderNumber || o.orderId}
									</div>
									<div>{o.formattedCreatedAt}</div>
									<div>
										<StatusBadge status={paymentStatus} />
									</div>
									<div>
										<StatusBadge
											status={processingStatus}
										/>
									</div>
									<div>
										{o.totalAmount} {o.currency}
									</div>
								</Link>
								<div className={styles.rowActions}>
									{isUnpaid(String(o.status)) ? (
										<Button
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												handlePayNow(o.orderId);
											}}
										>
											Pay now
										</Button>
									) : (
										<Button
											variant="outline"
											size="sm"
											as={Link as any}
											href={`orders/${o.orderId}`}
										>
											View details
										</Button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			<Drawer
				isOpen={activeOrderId != null}
				onOpenChange={(open) => !open && closeDrawer()}
				size="md"
			>
				<DrawerContent>
					{(close) => (
						<>
							<DrawerHeader>
								{activeOrder ? (
									<span>
										Order #
										{activeOrder.orderNumber ||
											activeOrder.orderId}
									</span>
								) : (
									'Order details'
								)}
							</DrawerHeader>
							<DrawerBody>
								{activeOrder ? (
									<div className={styles.drawerContent}>
										<div className={styles.detailsMeta}>
											<div>
												Date:{' '}
												{new Date(
													activeOrder.createdAt as unknown as string
												).toLocaleString()}
											</div>
											<div>
												Total: {activeOrder.totalAmount}{' '}
												{activeOrder.currency}
											</div>
										</div>
										<div className={styles.itemsList}>
											{activeOrder.details?.map((d) => (
												<div
													key={d.id}
													className={styles.itemRow}
												>
													<div>
														Package #{d.packageId}
													</div>
													<div>Qty: {d.quantity}</div>
													<div>Price: {d.price}</div>
													<div>
														Start: {d.startDate}
													</div>
												</div>
											))}
										</div>
									</div>
								) : (
									<div>Loading…</div>
								)}
							</DrawerBody>
							<DrawerFooter>
								{activeOrder &&
									isUnpaid(String(activeOrder.status)) && (
										<Button
											onClick={() =>
												activeOrder &&
												handlePayNow(
													activeOrder.orderId
												)
											}
											fullWidth
										>
											Pay now
										</Button>
									)}
								{activeOrder && (
									<Button
										variant="outline"
										as={Link as any}
										href={`/app/settings/orders/${activeOrder.orderId}`}
										target="_blank"
										rel="noopener noreferrer"
										fullWidth
									>
										Open full page ↗
									</Button>
								)}
								<Button
									variant="outline"
									onClick={() => {
										close();
										closeDrawer();
									}}
									fullWidth
								>
									Close
								</Button>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</div>
	);
}

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
