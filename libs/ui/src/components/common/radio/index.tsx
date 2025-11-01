import React from 'react';
import {
	Radio as HeroUIRadio,
	RadioGroup as HeroUIRadioGroup,
	RadioProps as HeroUIRadioProps,
	RadioGroupProps as HeroUIRadioGroupProps,
} from '@heroui/radio';

interface RadioProps extends HeroUIRadioProps {
	value: string;
	children?: React.ReactNode;
}

export const Radio = ({ children, ...props }: RadioProps) => {
	return <HeroUIRadio {...props}>{children}</HeroUIRadio>;
};

interface RadioGroupProps extends HeroUIRadioGroupProps {
	children: React.ReactNode;
	defaultValue?: string;
	name: string;
}

export const RadioGroup = ({
	children,
	defaultValue,
	name,
	...props
}: RadioGroupProps) => {
	return (
		<HeroUIRadioGroup defaultValue={defaultValue} name={name} {...props}>
			{children}
		</HeroUIRadioGroup>
	);
};
