import React from 'react';
import { CountryPackageInterface } from '@travelpulse/interfaces';

import styles from './countries.module.scss';
import { cn } from '../../utils';
import Image from 'next/image';

interface CountriesProps {
	data: CountryPackageInterface[];
	/** Add custom height for list */
	listHeight?: string;
}

const Countries = ({ data: countries, listHeight }: CountriesProps) => {
	return (
		<div className={styles.countriesContainer}>
			{countries.length > 1 && (
				<div className={styles.searchContainer}>
					<input
						type="text"
						placeholder="Search"
						className={styles.searchInput}
						aria-label="Search countries"
						autoFocus={false}
					/>
				</div>
			)}
			<ul className={cn(styles.countryList, listHeight)}>
				{countries.map((country) => (
					<li key={country.id}>
						<div className={styles.flag}>
							<Image
								src={country.flag}
								alt={`${country.name} flag`}
								width={36}
								height={20}
								className={styles.flagImage}
							/>
						</div>
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
