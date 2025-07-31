import React from 'react';
import styles from './styles.module.scss';
import { SelectItem } from '../select';
import { Country } from '@travelpulse/interfaces';

interface CountryItemProps {
	option: SelectItem<Country>;
}

export const CountryItem = ({ option }: CountryItemProps) => {
	return (
		<div className={styles.countryData}>
			<div className={styles.flagContainer}>
				<img
					src={option.data?.flag}
					className={styles.flag}
					alt={option.label}
				/>
			</div>
			<div className={styles.countryName}>
				<div>{option.label}</div>
			</div>
		</div>
	);
};
