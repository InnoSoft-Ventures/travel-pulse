'use client';

import React, {
	useEffect,
	useMemo,
	useState,
	useDeferredValue,
	useCallback,
} from 'react';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchOrders, createPaymentAttempt } from '@travelpulse/ui/thunks';
import { SelectItem, Title } from '@travelpulse/ui';
import styles from './styles.module.scss';
import { DateRange, dateJs } from '@travelpulse/utils';
import OrderDetailHeader from './order-detail-header';
import OrderItemRow from './order-item-row';

// Status bucketing without repeated toUpperCase
const STATUS_BUCKET: Record<
	string,
	'unpaid' | 'processing' | 'paid' | 'failed' | 'other'
> = {
	PENDING: 'unpaid',
	PROCESSING_PAYMENT: 'processing',
	PAID: 'paid',
	COMPLETED: 'paid',
	PAYMENT_FAILED: 'failed',
	CANCELLED: 'failed',
};

export default function OrdersClient() {
	const dispatch = useAppDispatch();

	// Select once; avoid deriving in component body
	const listState = useAppSelector((s) => s.account.orders.list);

	const [statusFilter, setStatusFilter] = useState<SelectItem>({
		label: 'All',
		value: 'all',
	});
	const [query, setQuery] = useState('');
	const [dates, setDates] = useState<DateRange>({
		startDate: dateJs(),
		endDate: dateJs(),
	});
	const [dateFilterOn, setDateFilterOn] = useState(false);

	// Smooth typing -> list filtering
	const deferredQuery = useDeferredValue(query);

	// Initial fetch / retry only when needed
	useEffect(() => {
		if (listState.status === 'idle' || listState.status === 'failed') {
			dispatch(fetchOrders());
		}
	}, [dispatch, listState.status]);

	// Normalize list once: attach bucket + createdAtMs so we don’t parse dates repeatedly
	const normalized = useMemo(() => {
		const rows = listState.list ?? [];
		return rows.map((o) => {
			const rawStatus = String(o.status ?? '').toUpperCase();
			const bucket = STATUS_BUCKET[rawStatus] ?? 'other';
			const createdAtMs = o.createdAt
				? new Date(String(o.createdAt)).getTime()
				: 0;
			return { ...o, __bucket: bucket, __createdAtMs: createdAtMs };
		});
	}, [listState.list]);

	// Compute allowed time range once (when needed)
	const dateBounds = useMemo(() => {
		if (!dateFilterOn || !dates.startDate || !dates.endDate) return null;
		return {
			start: dates.startDate.startOf('day').valueOf(),
			end: dates.endDate.endOf('day').valueOf(),
		};
	}, [dateFilterOn, dates.startDate, dates.endDate]);

	// Final filter: cheap predicates, no string uppercasing in the hot path
	const filtered = useMemo(() => {
		let rows = normalized;
		const statusOption = statusFilter.value;

		if (statusOption !== 'all') {
			rows = rows.filter((o) => o.__bucket === statusOption);
		}

		const q = deferredQuery.trim().toLowerCase();
		if (q) {
			rows = rows.filter(
				(o) =>
					String(o.orderNumber ?? '')
						.toLowerCase()
						.includes(q) ||
					String(o.orderId ?? '')
						.toLowerCase()
						.includes(q)
			);
		}

		if (dateBounds) {
			const { start, end } = dateBounds;
			rows = rows.filter(
				(o) => o.__createdAtMs >= start && o.__createdAtMs <= end
			);
		}

		return rows;
	}, [normalized, statusFilter, deferredQuery, dateBounds]);

	// Simple boolean precomputed once per row; avoid re-creating functions
	const isUnpaid = useCallback((status?: string) => {
		const bucket =
			STATUS_BUCKET[String(status ?? '').toUpperCase()] ?? 'other';
		return bucket === 'unpaid' || bucket === 'processing';
	}, []);

	// Don’t close over `filtered`. Row provides what we need.
	const handlePayNow = useCallback(
		async (orderId: number, currency: string) => {
			try {
				await (dispatch as any)(
					createPaymentAttempt({
						orderId,
						provider: 'paystack',
						method: 'card',
						currency,
					})
				).unwrap();
				// TODO: launchPaymentProvider(attempt, dispatch as any);
			} catch (e) {
				console.error('Failed to start payment:', e);
			}
		},
		[dispatch]
	);

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

			{listState.status === 'loading' && (
				<div className={styles.loading}>Loading orders…</div>
			)}
			{listState.status === 'failed' && (
				<div className={styles.error}>
					Could not load orders. Please try again.
				</div>
			)}
			{listState.status === 'succeeded' && filtered.length === 0 && (
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

					{/* Optional: swap for a windowed list if rows can be large */}
					{filtered.map((order) => (
						<OrderItemRow
							key={order.orderId}
							order={order}
							isUnpaid={isUnpaid(order.status)}
							handlePayNow={() =>
								handlePayNow(
									order.orderId as number,
									order.currency as string
								)
							}
						/>
					))}
				</div>
			)}
		</div>
	);
}
