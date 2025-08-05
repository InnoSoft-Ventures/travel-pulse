'use client';
import React from 'react';
import { ControlVariant, Select, SelectItem, SelectProps } from '../select';
import { useFilter } from '@react-aria/i18n';
import { Country } from '@travelpulse/interfaces';
import { CountryItem } from './country-item';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { getCountries } from '@travelpulse/state/thunks';

import styles from './styles.module.scss';
import { cn } from '../../../utils';

interface CountryPickerProps {
	startContent?: React.ReactNode;
	placeholder?: SelectProps['placeholder'];
	ariaLabel?: SelectProps['aria-label'];
	id?: string;
	label?: React.ReactNode;
	required?: boolean;
	radius?: SelectProps['radius'];
	name?: string;
	controlVariant?: ControlVariant;
	hideDropdownIndicator?: boolean;
	onData: (country: Country) => void;
	className?: string;
}

export const CountryPicker = (props: CountryPickerProps) => {
	const { onData, label, id, hideDropdownIndicator, className, ...rest } =
		props;

	const { contains } = useFilter({ sensitivity: 'base' });
	const dispatch = useAppDispatch();
	const { status } = useAppSelector((state) => state.masterData.countries);

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

		onData(selectedCountry);
	};

	return (
		<div className={cn(styles.countryPicker, className)}>
			{label && (
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			)}
			<div>
				<Select
					cacheOptions
					loadOptions={filterCountries}
					defaultOptions
					isSearchable
					id={id}
					isLoading={status === 'loading'}
					onChange={(selected) => {
						handleCountryChange(selected as SelectItem<Country>);
					}}
					filterOption={(option, inputValue) => {
						const countryOption = option as SelectItem<Country>;

						return contains(countryOption.label, inputValue);
					}}
					hideDropdownIndicator={hideDropdownIndicator}
					noOptionsMessage={() => 'No countries found'}
					hideIndicatorSeparator
					renderOption={(option: SelectItem<Country>) => {
						return <CountryItem option={option} />;
					}}
					{...rest}
				/>
			</div>
		</div>
	);
};
