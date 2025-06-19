'use client';
import React, { useState } from 'react';
import styles from './search-and-calendar.module.scss';
import { Button, InputProps } from '../common';
import LocationIcon from '../../assets/location.svg';
import { Calendar } from '../common/calendar';
import SearchIcon from '../../assets/white-search.svg';
import { cn } from '../../utils';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { Country } from '@travelpulse/interfaces';
import { DATE_FORMAT, dateJs, toast } from '@travelpulse/utils';
import { getCountries, productSearch } from '@travelpulse/state/thunks';
import { useFilter } from '@react-aria/i18n';
import Select, { SelectItem } from '../common/select';

interface SearchAndCalendarProps {
	className?: string;
	inputVariant?: InputProps['variant'];
}

interface SelectedData {
	country: Country | null;
	dates: Date[] | null;
}

const SearchAndCalendar = (props: SearchAndCalendarProps) => {
	const { className, inputVariant } = props;

	const { status } = useAppSelector((state) => state.masterData.countries);

	const [selectedData, setSelectedData] = useState<SelectedData>({
		country: null,
		dates: null,
	});

	const { contains } = useFilter({ sensitivity: 'base' });

	const dispatch = useAppDispatch();

	const filterCountries = async (inputValue: string) => {
		try {
			const countryList = await dispatch(
				getCountries(inputValue.trim())
			).unwrap();

			return countryList.map((country) => ({
				value: country.id,
				label: country.name,
				data: country,
			}));
		} catch (error) {
			console.error('Error fetching countries:', error);
			return [];
		}
	};

	const handleCountryChange = (selectedOption: SelectItem<Country>) => {
		const selectedCountry = selectedOption.data;

		if (!selectedCountry) {
			return;
		}

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
				<Select
					startContent={
						<div>
							<LocationIcon />
						</div>
					}
					required
					cacheOptions
					loadOptions={filterCountries}
					defaultOptions
					isSearchable
					name="country-search"
					placeholder="Where do you need internet?"
					aria-label="Select an destination"
					isLoading={status === 'loading'}
					onChange={(selected) => {
						handleCountryChange(selected as SelectItem<Country>);
					}}
					filterOption={(option, inputValue) => {
						const countryOption = option as SelectItem<Country>;

						return contains(countryOption.label, inputValue);
					}}
					hideDropdownIndicator
					noOptionsMessage={() => 'No countries found'}
					hideIndicatorSeparator
					renderOption={(option: SelectItem<Country>) => {
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
					}}
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
