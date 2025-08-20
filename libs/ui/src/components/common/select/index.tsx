'use client';
import React from 'react';
import ReactSelect, {
	components,
	ControlProps,
	CSSObjectWithLabel,
	OptionProps,
	Props as ReactSelectProps,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import { controlCSSObject, selectStyles } from './select-styles';
import styles from './select.module.scss';
import { Spinner } from '@heroui/spinner';

type SelectKey = string | number;

export interface SelectItem<T = any> {
	value: SelectKey;
	label: string;
	data?: T;
}

export type ControlVariant = 'primary' | 'secondary' | 'tertiary';

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

export interface SelectProps
	extends React.ComponentPropsWithoutRef<typeof ReactSelect>,
		React.ComponentPropsWithoutRef<typeof AsyncSelect>,
		ExtendedProps {
	options?: SelectItem[];
	controlVariant?: ControlVariant;
	radius?: 'sm' | 'md';
	hideDropdownIndicator?: boolean;
	hideIndicatorSeparator?: boolean;
	loadOptions?: (inputValue: string) => Promise<SelectItem[]>;
}

export function Select(props: SelectProps) {
	const {
		options = [],
		loadOptions,
		radius,
		hideDropdownIndicator = false,
		hideIndicatorSeparator = false,
		controlVariant = 'primary',
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

	let customStyles: typeof selectStyles = selectStyles;
	let styleObj: CSSObjectWithLabel | undefined;

	if (controlVariant === 'secondary') {
		styleObj = {
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
			backgroundColor: '#fffefe',
			border: '1px solid #fff',
			'&:hover': {
				border: '1px solid #fff',
				backgroundColor: '#fffefe',
			},
		};
	}

	if (controlVariant === 'tertiary') {
		styleObj = {
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
			backgroundColor: '#fffefe',
			border: '1px solid var(--dark-purple)',
			'&:focus': {
				borderColor:
					'rgb(76.3762376238, 76.3762376238, 126.6237623762)',
			},
			'&:hover': {
				border: '1px solid rgb(76.3762376238, 76.3762376238, 126.6237623762)',
				backgroundColor: '#fffefe',
			},
		};
	}

	if (radius === 'sm') {
		styleObj = {
			...styleObj,
			borderRadius: '8px',
		};
	}

	if (styleObj) {
		customStyles = {
			...selectStyles,
			control: (base) => ({
				...base,
				...controlCSSObject,
				...styleObj,
			}),
		};
	}

	return (
		<SelectComponent
			{...rest}
			classNamePrefix="tp-select"
			options={options}
			loadOptions={loadOptions}
			components={Components}
			styles={customStyles}
			// getOptionLabel={(e) => (
			// 	<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			// 		{e.startContent}
			// 		{e.label}
			// 	</div>
			// )}
			// getOptionValue={(e) => String(e.value)}
		/>
	);
}
