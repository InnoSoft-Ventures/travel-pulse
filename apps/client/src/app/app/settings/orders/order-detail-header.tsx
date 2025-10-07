import React, { useMemo, useCallback, useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { Button, DatePicker, Input, Select, SelectItem } from '@travelpulse/ui';
import { dateJs } from '@travelpulse/utils';

interface OrderDetailHeaderProps {
	setStatusFilter: React.Dispatch<React.SetStateAction<SelectItem>>;
	statusFilter: SelectItem;
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	dates: { startDate: dateJs.Dayjs; endDate: dateJs.Dayjs };
	setDates: React.Dispatch<
		React.SetStateAction<{ startDate: dateJs.Dayjs; endDate: dateJs.Dayjs }>
	>;
	dateFilterOn: boolean;
	setDateFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderDetailHeader({
	setStatusFilter,
	statusFilter,
	query,
	setQuery,
	dates,
	setDates,
	dateFilterOn,
	setDateFilterOn,
}: OrderDetailHeaderProps) {
	// Local debounced input to avoid parent re-render on each keystroke
	const [localQ, setLocalQ] = useState(query);

	useEffect(() => setLocalQ(query), [query]);

	useEffect(() => {
		const id = setTimeout(() => setQuery(localQ), 200);
		return () => clearTimeout(id);
	}, [localQ, setQuery]);

	const onDatesChange = useCallback(
		(d: { startDate: dateJs.Dayjs; endDate: dateJs.Dayjs }) => {
			setDates(d);
			setDateFilterOn(true);
		},
		[setDates, setDateFilterOn]
	);

	const onClearDates = useCallback(
		() => setDateFilterOn(false),
		[setDateFilterOn]
	);

	const options = useMemo<SelectItem[]>(
		() => [
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
		],
		[]
	);

	return (
		<div className={styles.filters}>
			<Input
				containerClassName={styles.search}
				placeholder="Search by order #"
				value={localQ}
				radius="sm"
				onChange={(e) => setLocalQ(e.target.value)}
			/>

			<div className="flex justify-end w-full gap-[20px]">
				<div className={styles.dateFilter}>
					<DatePicker
						hideSearchBtn
						showTravelingNote={false}
						dates={dates}
						setDates={onDatesChange}
						variant="secondary"
						radius="sm"
					/>
					{dateFilterOn && (
						<Button
							variant="outline"
							size="sm"
							onClick={onClearDates}
						>
							Clear date
						</Button>
					)}
				</div>
				<Select
					className={styles.statusSelector}
					controlVariant="secondary"
					options={options}
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

export default React.memo(OrderDetailHeader);
