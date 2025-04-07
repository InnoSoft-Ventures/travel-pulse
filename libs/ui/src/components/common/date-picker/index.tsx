import React from 'react';
import { Button } from '../button';
import { Input } from '../input';
import CalendarIcon from '../../../assets/calendar.svg';
import SearchIcon from '../../../assets/white-search.svg';
import styles from './date-picker.module.scss';
import { cn } from '../../../utils';

interface DatePickerProps {
	inputClassName?: string;
	btnClassName?: string;

	/** @default false */
	hideSearchBtn?: boolean;

	/** @default true */
	showTravelingNote?: boolean;
}

function DatePicker(props: DatePickerProps) {
	const {
		inputClassName,
		btnClassName,
		hideSearchBtn = false,
		showTravelingNote = true,
	} = props;

	return (
		<div className={styles.datePickerContainer}>
			<div className={styles.datePickerInputContainer}>
				<Input
					icon={<CalendarIcon />}
					type="text"
					size="large"
					id="date-picker"
					name="date-picker"
					placeholder="2024-09-18 to 2024-09-25"
					className={cn(styles.datePickerInput, inputClassName)}
				/>

				{!hideSearchBtn && (
					<div>
						<Button
							size="lg"
							icon={<SearchIcon />}
							className={cn(styles.searchBtn, btnClassName)}
						>
							Search
						</Button>
					</div>
				)}
			</div>

			{showTravelingNote && (
				<div className={styles.travelingNote}>
					You are traveling for <span>7 days</span>
				</div>
			)}
		</div>
	);
}

export { DatePicker };
