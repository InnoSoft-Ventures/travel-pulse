import React from 'react';
import { Button } from '../button';
import SearchIcon from '../../../assets/white-search.svg';
import styles from './date-picker.module.scss';
import { cn } from '../../../utils';
import { Calendar } from '../calendar';
import { calculateTravelDays, dateJs, DateRange } from '@travelpulse/utils';

interface DatePickerProps {
	inputClassName?: string;
	btnClassName?: string;
	dates: DateRange;
	setDates: (dates: DateRange) => void;

	/** @default false */
	hideSearchBtn?: boolean;

	/** @default true */
	showTravelingNote?: boolean;
	disabled?: boolean;
}

function DatePicker(props: DatePickerProps) {
	const {
		btnClassName,
		dates,
		setDates,
		hideSearchBtn = false,
		showTravelingNote = true,
		disabled = false,
	} = props;

	const { startDate, endDate } = dates;

	const days = calculateTravelDays(startDate, endDate);

	const handleDates = (inputDates: Date[]) => {
		const [start, end] = inputDates;
		setDates({
			startDate: dateJs(start),
			endDate: dateJs(end),
		});
	};

	return (
		<div className={styles.datePickerContainer}>
			<div className={styles.datePickerInputContainer}>
				<Calendar
					id="date-picker"
					size="large"
					disabled={disabled}
					value={[startDate?.toDate(), endDate?.toDate()]}
					onClose={handleDates}
					placeholder="Select dates"
					containerClassName={styles.datePickerInput}
				/>

				{!hideSearchBtn && (
					<div>
						<Button
							size="lg"
							startContent={<SearchIcon />}
							className={cn(styles.searchBtn, btnClassName)}
						>
							Search
						</Button>
					</div>
				)}
			</div>

			{showTravelingNote && (
				<div className={styles.travelingNote}>
					You are traveling for <span>{days} days</span>
				</div>
			)}
		</div>
	);
}

export { DatePicker };
