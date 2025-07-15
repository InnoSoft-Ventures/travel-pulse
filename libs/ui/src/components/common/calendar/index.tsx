'use client';

import React, { useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import CalendarIcon from '../../../assets/calendar.svg';
import styles from './calendar.module.scss';
import './calendar.scss';
import { cn } from '../../../utils';
import { cva, VariantProps } from 'class-variance-authority';

const calendarVariants = cva(styles.inputContainer, {
	variants: {
		variant: {
			default: styles.default,
			secondary: styles.secondary,
		},
		size: {
			default: styles.defaultSize,
			large: styles.largeSize,
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

interface CalendarProps extends VariantProps<typeof calendarVariants> {
	id?: string;
	mode?: 'single' | 'multiple' | 'range';
	/**
	 * Date format for the calendar.
	 * Documentation: https://flatpickr.js.org/formatting/#date-formatting-tokens
	 * @default 'Y-m-d'
	 */
	dateFormat?: string;

	/**
	 * Allows the user to enter a date directly into the input field. By default, direct entry is enabled.
	 * @default true
	 */
	allowInput?: boolean;

	/**
	 * The conjunction to use between the dates in the input field.
	 * @default 'to'
	 */
	conjunction?: string;
	inputClassName?: string;
	containerClassName?: string;
	lastIcon?: React.ReactNode;
	error?: string;
	onChange?: (dates: Date[]) => void;
	onClose?: (dates: Date[]) => void;
	onMonthChange?: (date: Date[]) => void;
	onYearChange?: (date: Date[]) => void;
	value?: Date[];
	defaultValue?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
}

function Calendar(props: CalendarProps) {
	const {
		id,
		lastIcon,
		inputClassName,
		required,
		containerClassName,
		error,
		onChange,
		value,
		defaultValue,
		variant,
		size,
		onClose,
		onMonthChange,
		onYearChange,
		mode = 'range',
		dateFormat = 'Y-m-d',
		allowInput = true,
		conjunction = 'to',
		placeholder = 'Select date',
		disabled = false,
	} = props;

	const pickerInstance = useRef<Flatpickr>(null);

	return (
		<div className={cn(styles.container, containerClassName)}>
			<label
				htmlFor={id}
				className={cn(
					calendarVariants({ variant, size }),
					inputClassName
				)}
				aria-disabled={disabled}
			>
				<button
					type="button"
					onClick={() => {
						if (pickerInstance.current) {
							pickerInstance.current.flatpickr.open();
						}
					}}
					className={styles.calendarIcon}
					disabled={disabled}
					aria-label="Open calendar"
				>
					<CalendarIcon />
				</button>
				<Flatpickr
					className={styles.input}
					options={{
						mode,
						dateFormat,
						allowInput,
						conjunction,
					}}
					required={required}
					value={value}
					placeholder={placeholder}
					defaultValue={defaultValue}
					disabled={disabled}
					onMonthChange={(dates) => onMonthChange?.(dates)}
					onYearChange={(dates) => onYearChange?.(dates)}
					onClose={(dates) => onClose?.(dates)}
					onChange={(dates) => {
						onChange?.(dates);
					}}
					ref={pickerInstance}
				/>

				{lastIcon && <div>{lastIcon}</div>}
			</label>
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
}
export { Calendar };
