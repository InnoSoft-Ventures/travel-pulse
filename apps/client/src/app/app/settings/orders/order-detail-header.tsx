import React from 'react';
import styles from './styles.module.scss';
import { Button, DatePicker, Input } from '@travelpulse/ui';
import { dateJs } from '@travelpulse/utils';

interface OrderDetailHeaderProps {
	setStatusFilter: React.Dispatch<
		React.SetStateAction<
			'all' | 'unpaid' | 'processing' | 'paid' | 'failed'
		>
	>;
	statusFilter: 'all' | 'unpaid' | 'processing' | 'paid' | 'failed';
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	dates: {
		startDate: dateJs.Dayjs;
		endDate: dateJs.Dayjs;
	};
	setDates: React.Dispatch<
		React.SetStateAction<{
			startDate: dateJs.Dayjs;
			endDate: dateJs.Dayjs;
		}>
	>;
	dateFilterOn: boolean;
	setDateFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderDetailHeader(props: OrderDetailHeaderProps) {
	const {
		setStatusFilter,
		statusFilter,
		query,
		setQuery,
		dates,
		setDates,
		dateFilterOn,
		setDateFilterOn,
	} = props;

	return (
		<div className={styles.filters}>
			<Input
				containerClassName={styles.search}
				placeholder="Search by order #"
				value={query}
				radius="sm"
				onChange={(e) => setQuery(e.target.value)}
			/>
			<div className={styles.dateFilter}>
				<DatePicker
					hideSearchBtn
					showTravelingNote={false}
					dates={dates}
					setDates={(d) => {
						setDates(d);
						setDateFilterOn(true);
					}}
					variant="secondary"
					radius="6px"
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
	);
}

export default OrderDetailHeader;
