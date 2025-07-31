'use client';
import React, { useState } from 'react';
import styles from './search-and-calendar.module.scss';
import { Button, CountryPicker, InputProps } from '../common';
import LocationIcon from '../../assets/location.svg';
import { Calendar } from '../common/calendar';
import SearchIcon from '../../assets/white-search.svg';
import { cn } from '../../utils';
import { setSearchData, useAppDispatch } from '@travelpulse/state';
import { Country, SelectedSearchData } from '@travelpulse/interfaces';
import { DATE_FORMAT, dateJs, toast } from '@travelpulse/utils';
import { productSearch } from '@travelpulse/state/thunks';
import { ControlVariant } from '../common/select';

interface SearchAndCalendarProps {
	className?: string;
	inputVariant?: InputProps['variant'];
	controlVariant?: ControlVariant;
}

const SearchAndCalendar = (props: SearchAndCalendarProps) => {
	const { className, inputVariant, controlVariant } = props;

	// const { searchData } = useAppSelector((state) => state.products);

	const [selectedData, setSelectedData] = useState<SelectedSearchData>({
		country: null,
		dates: null,
	});

	const dispatch = useAppDispatch();

	const handleCountryChange = (selectedCountry: Country) => {
		setSelectedData((prev) => ({
			...prev,
			country: selectedCountry,
		}));
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const { country, dates } = selectedData;

			if (!country || !dates) {
				toast.error({
					title: 'Please select a country and dates before searching.',
				});
				return;
			}

			if (dates.length !== 2) {
				toast.error({
					title: 'Please select both arrival and departure dates.',
				});
				return;
			}

			const [startDate, endDate] = dates;

			if (startDate > endDate) {
				toast.error({
					title: 'Arrival date cannot be later than departure date.',
				});
				return;
			}

			const datesFormat = selectedData.dates
				? selectedData.dates.map((date) =>
						dateJs(date).format(DATE_FORMAT)
				  )
				: null;
			dispatch(
				setSearchData({
					...selectedData,
					dates: datesFormat,
				})
			);

			dispatch(
				productSearch({
					country: country.slug,
					from: dateJs(startDate).format(DATE_FORMAT),
					to: dateJs(endDate).format(DATE_FORMAT),
				})
			);
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	return (
		<form onSubmit={handleFormSubmit}>
			<div className={cn(styles.searchContainer, className)}>
				<CountryPicker
					startContent={
						<div>
							<LocationIcon />
						</div>
					}
					onData={handleCountryChange}
					name="country-search"
					placeholder="Where do you need internet?"
					aria-label="Select an destination"
					controlVariant={controlVariant}
					required
				/>

				<Calendar
					id="date-picker"
					variant={inputVariant}
					size="large"
					required
					onChange={(dates) => {
						setSelectedData((prev) => ({
							...prev,
							dates,
						}));
					}}
					placeholder="Arrival & Departure"
					containerClassName={styles.datePickerInput}
				/>
				<div>
					<Button
						size="lg"
						startContent={<SearchIcon />}
						type="submit"
						className={styles.searchBtn}
					>
						Search
					</Button>
				</div>
			</div>
		</form>
	);
};

export { SearchAndCalendar };
