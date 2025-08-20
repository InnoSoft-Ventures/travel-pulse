import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { Country } from '@travelpulse/interfaces';
import { CountryPicker } from './country-picker';

type FormCountryPickerProps<TFieldValues extends FieldValues> =
	UseControllerProps<TFieldValues> &
		Omit<
			React.ComponentProps<typeof CountryPicker>,
			'value' | 'onChange' | 'onBlur' | 'name'
		> & {
			name: string;
			onData?: (country: Country) => void;
			defaultValue?: Country | null;
		};

export const FormCountryPicker = <TFieldValues extends FieldValues>(
	props: FormCountryPickerProps<TFieldValues>
) => {
	const { control, name, onData, rules, defaultValue, ...rest } = props;

	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			defaultValue={(defaultValue as any) ?? null}
			render={({ field, fieldState }) => (
				<CountryPicker
					{...rest}
					name={name}
					value={(field.value as Country | null) ?? null}
					onChange={(country) => field.onChange(country)}
					onBlur={field.onBlur}
					onData={(c) => onData?.(c)}
					error={fieldState.error?.message}
				/>
			)}
		/>
	);
};
