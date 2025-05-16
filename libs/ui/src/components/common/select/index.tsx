'use client';
import React from 'react';
import ReactSelect, {
	components,
	ControlProps,
	OptionProps,
	Props as ReactSelectProps,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import { selectStyles } from './select-styles';
import styles from './select.module.scss';
import { Spinner } from '@heroui/spinner';

type SelectKey = string | number;

export interface SelectItem<T = any> {
	value: SelectKey;
	label: string;
	data?: T;
}

interface ExtendedProps {
	startContent?: React.ReactNode;
	renderOption?: (option: SelectItem) => React.ReactNode;
}

const Control = ({ children, ...props }: ControlProps) => {
	const { startContent } = props.selectProps as ExtendedProps;

	return (
		<components.Control {...props}>
			{startContent && (
				<div style={{ marginRight: 8 }}>{startContent}</div>
			)}

			{children}
		</components.Control>
	);
};

const Option = (props: OptionProps) => {
	const { renderOption } = props.selectProps as ExtendedProps;

	if (!renderOption) {
		return <components.Option {...props} />;
	}

	return (
		<components.Option {...props}>
			{renderOption(props.data as SelectItem)}
		</components.Option>
	);
};

interface SelectProps
	extends React.ComponentPropsWithoutRef<typeof ReactSelect>,
		React.ComponentPropsWithoutRef<typeof AsyncSelect>,
		ExtendedProps {
	options?: SelectItem[];
	hideDropdownIndicator?: boolean;
	hideIndicatorSeparator?: boolean;
	loadOptions?: (inputValue: string) => Promise<SelectItem[]>;
}

const Select = (props: SelectProps) => {
	const {
		options = [],
		loadOptions,
		hideDropdownIndicator = false,
		hideIndicatorSeparator = false,
		...rest
	} = props;

	// const [defaultOptions, setDefaultOptions] = React.useState<SelectItem[]>(
	// 	[]
	// );
	// const [menuIsOpen, setMenuIsOpen] = React.useState(false);

	// const handleMenuOpen = async () => {
	// 	if (loadOptions && defaultOptions.length === 0) {
	// 		const loaded = await loadOptions('');
	// 		console.log(loaded);

	// 		setDefaultOptions(loaded);
	// 	}
	// 	setMenuIsOpen(true);
	// };

	let Components: ReactSelectProps['components'] = {
		Control,
		Option,
		LoadingIndicator: () => (
			<Spinner
				classNames={{
					base: styles.spinnerBase,
					circle1: styles.spinnerCircle1,
					wrapper: styles.spinnerWrapper,
				}}
			/>
		),
	};

	if (hideDropdownIndicator) {
		Components.DropdownIndicator = () => null;
	}

	if (hideIndicatorSeparator) {
		Components.IndicatorSeparator = () => null;
	}

	const SelectComponent = loadOptions ? AsyncSelect : ReactSelect;

	return (
		<SelectComponent
			{...rest}
			classNamePrefix="tp-select"
			options={options}
			loadOptions={loadOptions}
			components={Components}
			styles={selectStyles}
			// getOptionLabel={(e) => (
			// 	<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			// 		{e.startContent}
			// 		{e.label}
			// 	</div>
			// )}
			// getOptionValue={(e) => String(e.value)}
		/>
	);
};

export default Select;
