import React from 'react';
import { Button } from '../button';
import { Input } from '../input';
import CalendarIcon from '../../../assets/calendar.svg';
import SearchIcon from '../../../assets/white-search.svg';
import styles from './date-picker.module.scss';

function DatePicker() {
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
					className={styles.datePickerInput}
				/>
				<div>
					<Button
						size="lg"
						icon={<SearchIcon />}
						className={styles.searchBtn}
					>
						Search
					</Button>
				</div>
			</div>
			<div className={styles.travelingNote}>
				You are traveling for <span>7 days</span>
			</div>
		</div>
	);
}

export { DatePicker };
