'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrders, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { Title, Button, Modal, DatePicker } from '@travelpulse/ui';
import styles from './styles.module.scss';
import { DateRange, dateJs } from '@travelpulse/utils';
// import { launchPaymentProvider } from '@travelpulse/ui';

export default function OrdersClient() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { list } = useAppSelector((s) => s.account.orders);

	const [statusFilter, setStatusFilter] = useState<
		'all' | 'unpaid' | 'processing' | 'paid' | 'failed'
	>('all');
	const [query, setQuery] = useState('');
	const [dates, setDates] = useState<DateRange>({
		startDate: dateJs(),
		endDate: dateJs(),
	});

	const [expanded, setExpanded] = useState<Record<number, boolean>>({});
	const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

	useEffect(() => {
		if (list.status === 'idle' || list.status === 'failed') {
			dispatch(fetchOrders());
		}
	}, [dispatch]);

	const filtered = useMemo(() => {
		let rows = list.list;
		// Status filter
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
		// Search by order number/id
		const q = query.trim().toLowerCase();
		if (q) {
			rows = rows.filter(
				(o) =>
					String(o.orderNumber).toLowerCase().includes(q) ||
					String(o.orderId).toLowerCase().includes(q)
			);
		}
		// Date range filter (inclusive)
		if (dates.startDate && dates.endDate) {
			const start = dates.startDate.startOf('day').toDate().getTime();
			const end = dates.endDate.endOf('day').toDate().getTime();
			rows = rows.filter((o) => {
				const t = new Date(o.createdAt as unknown as string).getTime();
				return t >= start && t <= end;
			});
		}
		return rows;
	}, [list.list, statusFilter, query, dates]);

	const toggleExpand = useCallback((id: number) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	const openDetails = useCallback(
		(id: number) => {
			// navigate to parallel modal route so the page stays rendered
			router.push(`/app/settings/orders/${id}`);
		},
		[router]
	);
	const closeDetails = useCallback(() => setSelectedOrderId(null), []);

	const selectedOrder = useMemo(
		() => filtered.find((o) => o.orderId === selectedOrderId) || null,
		[filtered, selectedOrderId]
	);

	const isUnpaid = (status?: string) => {
		const s = String(status).toUpperCase();
		return s === 'PENDING' || s === 'PROCESSING_PAYMENT';
	};

	const handlePayNow = async (orderId: number) => {
		try {
			const order = filtered.find((o) => o.orderId === orderId);
			if (!order) return;
			const attempt = await (dispatch as any)(
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
							setDates={setDates}
						/>
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
						<div>Status</div>
						<div>Total</div>
					</div>
					{filtered.map((o) => (
						<div key={o.orderId} className={styles.rowContainer}>
							<div
								className={styles.tableRow}
								onClick={() => toggleExpand(o.orderId)}
							>
								<div>#{o.orderNumber || o.orderId}</div>
								<div>
									{new Date(
										o.createdAt as unknown as string
									).toLocaleString()}
								</div>
								<div>
									<StatusBadge status={String(o.status)} />
								</div>
								<div className={styles.totalCell}>
									{o.totalAmount} {o.currency}
									<div className={styles.rowActions}>
										<Button
											size="sm"
											variant="outline"
											onClick={(e) => {
												e.stopPropagation();
												openDetails(o.orderId);
											}}
										>
											View details
										</Button>
										{isUnpaid(String(o.status)) && (
											<Button
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													handlePayNow(o.orderId);
												}}
											>
												Pay now
											</Button>
										)}
									</div>
								</div>
							</div>
							{expanded[o.orderId] && (
								<div className={styles.expanded}>
									<div className={styles.itemsHeader}>
										Items
									</div>
									<div className={styles.itemsList}>
										{o.details?.map((d) => (
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
						</div>
					))}
				</div>
			)}

			<Modal
				open={!!selectedOrder}
				onClose={closeDetails}
				size="medium"
				center
			>
				{selectedOrder && (
					<div className={styles.detailsModal}>
						<div className={styles.detailsHeader}>
							<Title size="size16">
								Order #
								{selectedOrder.orderNumber ||
									selectedOrder.orderId}
							</Title>
							<div>
								<StatusBadge
									status={String(selectedOrder.status)}
								/>
							</div>
						</div>
						<div className={styles.detailsMeta}>
							<div>
								Date:{' '}
								{new Date(
									selectedOrder.createdAt as unknown as string
								).toLocaleString()}
							</div>
							<div>
								Total: {selectedOrder.totalAmount}{' '}
								{selectedOrder.currency}
							</div>
						</div>
						<div className={styles.itemsList}>
							{selectedOrder.details?.map((d) => (
								<div key={d.id} className={styles.itemRow}>
									<div>Package #{d.packageId}</div>
									<div>Qty: {d.quantity}</div>
									<div>Price: {d.price}</div>
									<div>Start: {d.startDate}</div>
								</div>
							))}
						</div>
						{isUnpaid(String(selectedOrder.status)) && (
							<div className={styles.modalActions}>
								<Button
									fullWidth
									onClick={() =>
										handlePayNow(selectedOrder.orderId)
									}
								>
									Pay now
								</Button>
							</div>
						)}
					</div>
				)}
			</Modal>
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
