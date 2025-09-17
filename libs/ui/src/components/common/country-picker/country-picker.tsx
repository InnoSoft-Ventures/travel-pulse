'use client';
import React, { useCallback, useMemo } from 'react';
import { ControlVariant, Select, SelectItem, SelectProps } from '../select';
import { useFilter } from '@react-aria/i18n';
import { Country } from '@travelpulse/interfaces';
import { CountryItem } from './country-item';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { getCountries } from '@travelpulse/state/thunks';
import styles from './styles.module.scss';
import { cn } from '../../../utils';

type CountryOption = SelectItem<Country>;

export interface CountryPickerProps {
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
	/** RHF value: keep raw Country in form state */
	value?: Country | null;
	/** RHF change: receive raw Country (or null) */
	onChange?: (country: Country | null) => void;
	/** RHF blur */
	onBlur?: () => void;
	/** For side-effects */
	onData?: (country: Country) => void;
	className?: string;
	error?: string;
	isDisabled?: boolean;
}

export const CountryPicker = (props: CountryPickerProps) => {
	const {
		onData,
		label,
		id,
		hideDropdownIndicator,
		className,
		value,
		onChange,
		onBlur,
		error,
		...rest
	} = props;

	const { contains } = useFilter({ sensitivity: 'base' });
	const dispatch = useAppDispatch();
	const { status } = useAppSelector((s) => s.app.masterData.countries);

	const toOption = useCallback(
		(country: Country): CountryOption => ({
			value: String(country.id),
			label: country.name,
			data: country,
		}),
		[]
	);

	const selectedOption = useMemo<CountryOption | undefined>(() => {
		return value ? toOption(value) : undefined;
	}, [value, toOption]);

	const loadOptions = useCallback(
		async (inputValue: string): Promise<CountryOption[]> => {
			try {
				const list = await dispatch(
					getCountries(inputValue.trim())
				).unwrap();
				return list.map(toOption);
			} catch (e) {
				console.error('Error fetching countries:', e);
				return [];
			}
		},
		[dispatch, toOption]
	);

	const handleChange = useCallback(
		(opt: CountryOption | null) => {
			const country = opt?.data ?? null;
			if (country) onData?.(country);
			onChange?.(country);
		},
		[onChange, onData]
	);

	return (
		<div className={cn(styles.countryPicker, className)}>
			{label && (
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			)}

			<Select
				id={id}
				cacheOptions
				defaultOptions
				isSearchable
				isClearable
				isLoading={status === 'loading'}
				loadOptions={loadOptions}
				value={selectedOption}
				onChange={(opt) => handleChange((opt as CountryOption) ?? null)}
				onBlur={onBlur}
				/** critical for controlled equality */
				getOptionValue={(opt) =>
					String((opt as CountryOption).data?.id)
				}
				getOptionLabel={(opt) =>
					(opt as CountryOption).data?.name || ''
				}
				/** client-side fallback filter (optional) */
				filterOption={(option, inputValue) => {
					const o = option as CountryOption;
					return contains(o.label, inputValue);
				}}
				renderOption={(option: CountryOption) => (
					<CountryItem option={option} />
				)}
				hideDropdownIndicator={hideDropdownIndicator}
				hideIndicatorSeparator
				noOptionsMessage={() => 'No countries found'}
				aria-invalid={!!error || undefined}
				aria-errormessage={error ? `${id}-error` : undefined}
				{...rest}
			/>

			{error && (
				<div id={`${id}-error`} className={styles.error}>
					{error}
				</div>
			)}
		</div>
	);
};
