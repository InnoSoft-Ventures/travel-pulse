'use client';
import React from 'react';
import { Hero } from '../layout/hero';
import styles from './style.module.scss';

import { SearchAndCalendar } from '../search-and-calendar';

interface DestinationHeaderProps {
	title: string;
	subTitle: React.ReactNode;
	/**
	 * Enable or disable the search bar
	 * @default true
	 */
	enableSearch?: boolean;
}

const DestinationHeader = (props: DestinationHeaderProps) => {
	const { title, subTitle, enableSearch = true } = props;

	return (
		<Hero>
			<div className={styles.destinationContainer}>
				<div>
					<h1 className={styles.title}>{title}</h1>
					<h2 className={styles.subTitle}>{subTitle}</h2>
				</div>
				{enableSearch && (
					<SearchAndCalendar
						className={styles.searchContainer}
						controlVariant="secondary"
					/>
				)}
			</div>
		</Hero>
	);
};

export { DestinationHeader };
