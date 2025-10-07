import React from 'react';
import styles from './styles.module.scss';
import { Button, DatePicker, Input, Select, SelectItem } from '@travelpulse/ui';
import { dateJs } from '@travelpulse/utils';

interface OrderDetailHeaderProps {
	setStatusFilter: React.Dispatch<React.SetStateAction<SelectItem>>;
	statusFilter: SelectItem;
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
				size="large"
				onChange={(e) => setQuery(e.target.value)}
			/>
			<div className="flex justify-end w-full gap-[20px]">
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
						radius="sm"
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
				<Select
					className={styles.statusSelector}
					controlVariant="secondary"
					options={[
						{
							label: 'All',
							value: 'all',
						},
						{
							label: 'Unpaid',
							value: 'unpaid',
						},
						{
							label: 'Processing',
							value: 'processing',
						},
						{
							label: 'Paid',
							value: 'paid',
						},
						{
							label: 'Failed',
							value: 'failed',
						},
					]}
					radius="sm"
					value={statusFilter}
					onChange={(option) => {
						setStatusFilter(option as SelectItem);
					}}
				/>
			</div>
		</div>
	);
}

export default OrderDetailHeader;
