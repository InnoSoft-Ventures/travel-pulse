import React from 'react';
import {
	Checkbox as HeroUICheckbox,
	CheckboxProps as HeroUICheckboxProps,
} from '@heroui/checkbox';

import styles from './checkbox.module.scss';

export interface CheckboxProps extends HeroUICheckboxProps {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	(props, ref) => {
		const { color, ...rest } = props;

		if (color && color === 'primary') {
			rest.classNames = {
				base: styles.primary,
			};
		}

		return <HeroUICheckbox ref={ref} {...rest} />;
	}
);

Checkbox.displayName = 'Checkbox';
