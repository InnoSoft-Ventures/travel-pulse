'use client';
import React, { useEffect, useState } from 'react';
import * as RHF from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
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

	const Controller: any = (RHF as any).Controller;
	const useController: any = (RHF as any).useController;

	if (Controller) {
		return (
			<Controller
				control={control}
				name={name}
				rules={rules}
				defaultValue={(defaultValue as any) ?? null}
				render={({ field, fieldState }: any) => (
					<CountryPicker
						{...rest}
						name={name}
						value={(field.value as Country | null) ?? null}
						onChange={(country) => field.onChange(country)}
						onBlur={field.onBlur}
						onData={(c) => onData?.(c)}
						error={fieldState?.error?.message}
					/>
				)}
			/>
		);
	}

	if (useController) {
		const { field, fieldState } = useController({
			control,
			name,
			rules,
			defaultValue: (defaultValue as any) ?? null,
		});

		return (
			<CountryPicker
				{...rest}
				name={name}
				value={(field.value as Country | null) ?? null}
				onChange={(country) => field.onChange(country)}
				onBlur={field.onBlur}
				onData={(c) => onData?.(c)}
				error={fieldState?.error?.message}
			/>
		);
	}

	// Graceful fallback: uncontrolled within component (no RHF binding)
	const [val, setVal] = useState<Country | null>(
		(defaultValue as any) ?? null
	);
	useEffect(() => {
		setVal((defaultValue as any) ?? null);
	}, [defaultValue]);

	return (
		<CountryPicker
			{...rest}
			name={name}
			value={val}
			onChange={(country) => {
				setVal(country);
				if (country) onData?.(country as Country);
			}}
			onBlur={() => void 0}
			error={undefined}
		/>
	);
};
