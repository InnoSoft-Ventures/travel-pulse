import React from 'react';
import styles from './counter.module.scss';

interface CounterProps {
	value: number;
	disabled?: boolean;
	onChange: (value: number) => void;
	maxValue?: number;
	minValue?: number;
}

export const Counter = (props: CounterProps) => {
	const {
		value,
		disabled = false,
		onChange,
		minValue = 0,
		maxValue = 99,
	} = props;

	const handleMinusClick = () => {
		if (onChange && value !== undefined) {
			let newValue = value - 1;

			if (newValue < minValue) {
				newValue = minValue;
			}

			onChange(Math.max(0, newValue));
		}
	};

	const handlePlusClick = () => {
		if (onChange && value !== undefined) {
			let newValue = value + 1;

			if (newValue > maxValue) {
				newValue = maxValue;
			}

			onChange(newValue);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value);

		if (newValue < minValue) {
			onChange(minValue);
			return;
		}

		if (newValue > maxValue) {
			onChange(maxValue);
			return;
		}

		if (onChange) {
			onChange(Math.max(0, newValue));
		}
	};

	return (
		<div className={styles.counterContainer}>
			<button className={styles.counterMinus} onClick={handleMinusClick}>
				-
			</button>
			<div className={styles.counterValue}>
				<input
					type="number"
					value={value}
					disabled={disabled}
					onChange={handleChange}
				/>
			</div>
			<button className={styles.counterPlus} onClick={handlePlusClick}>
				+
			</button>
		</div>
	);
};
