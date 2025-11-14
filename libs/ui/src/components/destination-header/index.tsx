'use client';
import React from 'react';
import { Hero } from '../layout/hero';
import styles from './style.module.scss';

import { SearchAndCalendar } from '../search-and-calendar';

interface DestinationHeaderProps {
	title: React.ReactNode;
	subTitle: React.ReactNode;
	/**
	 * Enable or disable the search bar
	 * @default true
	 */
	enableSearch?: boolean;
	skeleton?: React.ReactNode;
}

const DestinationHeader = (props: DestinationHeaderProps) => {
	const { title, subTitle, enableSearch = true, skeleton = null } = props;

	return (
		<Hero>
			<div className={styles.destinationContainer}>
				<div>
					<h1 className={styles.title}>{title}</h1>
					<h2 className={styles.subTitle}>{subTitle}</h2>
				</div>
				{enableSearch && !skeleton && (
					<SearchAndCalendar
						className={styles.searchContainer}
						controlVariant="secondary"
					/>
				)}

				{skeleton}
			</div>
		</Hero>
	);
};

export { DestinationHeader };
