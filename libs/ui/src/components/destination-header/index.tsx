'use client';
import React from 'react';
import { Hero } from '../layout/hero';
import { Input } from '../common/input';
import styles from './style.module.scss';
import LocationIcon from '../../assets/location.svg';
import SearchIcon from '../../assets/white-search.svg';
import { Button } from '../common/button';
import { Calendar } from '../common/calendar';

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
					<div className={styles.searchContainer}>
						<Input
							icon={<LocationIcon />}
							type="search"
							id="header-location-search"
							name="location-search"
							size="large"
							placeholder="Where do you need internet?"
						/>
						<Calendar
							id="date-picker"
							size="large"
							onChange={(dates) => {
								console.log(dates);
							}}
							placeholder="Arrival & Departure"
							containerClassName={styles.datePickerInput}
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
				)}
			</div>
		</Hero>
	);
};

export { DestinationHeader };
