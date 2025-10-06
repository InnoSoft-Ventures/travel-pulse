import React from 'react';
import { Button } from '../button';
import SearchIcon from '../../../assets/white-search.svg';
import styles from './date-picker.module.scss';
import { cn } from '../../../utils';
import { Calendar } from '../calendar';
import { calculateTravelDays, dateJs, DateRange } from '@travelpulse/utils';
import { cva, VariantProps } from 'class-variance-authority';

const datePickerVariants = cva(styles.datePickerInput, {
	variants: {
		variant: {
			primary: styles.purpleGradient,
			secondary: styles.gray,
		},
		radius: {
			'6px': styles.radius6px,
			'15px': styles.radius15px,
		},
	},
	defaultVariants: {
		variant: 'primary',
		radius: '15px',
	},
});

interface DatePickerProps extends VariantProps<typeof datePickerVariants> {
	inputClassName?: string;
	btnClassName?: string;
	dates: DateRange;
	setDates: (dates: DateRange) => void;

	/** @default false */
	hideSearchBtn?: boolean;

	/** @default true */
	showTravelingNote?: boolean;
	disabled?: boolean;
	hideStartIcon?: boolean;
}

function DatePicker(props: DatePickerProps) {
	const {
		btnClassName,
		dates,
		setDates,
		hideSearchBtn = false,
		showTravelingNote = true,
		disabled = false,
		variant,
		radius,
		hideStartIcon = false,
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
					containerClassName={cn(
						datePickerVariants({ variant, radius })
					)}
					hideStartIcon={hideStartIcon}
					radius={radius}
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
