import * as React from 'react';
import styles from './input.module.scss';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const inputVariants = cva(styles.inputContainer, {
	variants: {
		variant: {
			default: styles.default,
			secondary: styles.secondary,
		},
		size: {
			default: styles.defaultSize,
			large: styles.largeSize,
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

interface InputProps
	extends Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			'size' | 'className'
		>,
		VariantProps<typeof inputVariants> {
	inputClassName?: string;
	containerClassName?: string;
	type?: 'search' | 'text' | 'password' | 'email';
	icon?: React.ReactNode;
	lastIcon?: React.ReactNode;
	error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const {
		id,
		type = 'text',
		icon,
		lastIcon,
		inputClassName,
		containerClassName,
		variant,
		size,
		error,
		...rest
	} = props;

	return (
		<div className={cn(styles.container, containerClassName)}>
			<label
				htmlFor={id}
				className={cn(inputVariants({ variant, size }), inputClassName)}
			>
				{icon && <div>{icon}</div>}
				<input type={type} id={id} ref={ref} {...rest} />
				{lastIcon && <div>{lastIcon}</div>}
			</label>
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
});

Input.displayName = 'Input';

export { Input };
