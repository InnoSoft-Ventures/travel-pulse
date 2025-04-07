import React from 'react';
import { Country } from '@travelpulse/interfaces';

import styles from './countries.module.scss';
import { cn } from '../../utils';

export const dummyCountries: Country[] = [
	{ id: 1, name: 'Albania', code: 'AL', flag: '🇦🇱' },
	{ id: 2, name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
	{ id: 3, name: 'Canada', code: 'CA', flag: '🇨🇦' },
	{ id: 4, name: 'Denmark', code: 'DK', flag: '🇩🇰' },
	{ id: 5, name: 'Egypt', code: 'EG', flag: '🇪🇬' },
	{ id: 6, name: 'France', code: 'FR', flag: '🇫🇷' },
	{ id: 7, name: 'Germany', code: 'DE', flag: '🇩🇪' },
	{ id: 8, name: 'Hungary', code: 'HU', flag: '🇭🇺' },
	{ id: 9, name: 'India', code: 'IN', flag: '🇮🇳' },
	{ id: 10, name: 'Japan', code: 'JP', flag: '🇯🇵' },
];

interface CountriesProps {
	data: Country[];
	/** Add custom height for list */
	listHeight?: string;
}

const Countries = ({ data: countries, listHeight }: CountriesProps) => {
	return (
		<div className={styles.countriesContainer}>
			<div className={styles.searchContainer}>
				<input
					type="text"
					placeholder="Search"
					className={styles.searchInput}
				/>
			</div>
			<ul className={cn(styles.countryList, listHeight)}>
				{countries.map((country) => (
					<li key={country.id}>
						<div className={styles.flag}>{country.flag}</div>
						<span className={styles.countryName}>
							{country.name}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export { Countries };
