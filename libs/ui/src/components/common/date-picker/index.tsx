import React from 'react';
import { Button } from '../button';
import SearchIcon from '../../../assets/white-search.svg';
import styles from './date-picker.module.scss';
import { cn } from '../../../utils';
import { Calendar } from '../calendar';

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
		btnClassName,
		hideSearchBtn = false,
		showTravelingNote = true,
	} = props;

	const [dates, setDates] = React.useState<Date[]>([new Date()]);

	return (
		<div className={styles.datePickerContainer}>
			<div className={styles.datePickerInputContainer}>
				<Calendar
					id="date-picker"
					size="large"
					value={dates}
					onClose={setDates}
					placeholder="Select dates"
					containerClassName={styles.datePickerInput}
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
