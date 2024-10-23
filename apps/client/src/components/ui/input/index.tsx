import React from 'react';
import styles from './input.module.scss';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from 'lib/utils';

const inputVariants = cva(styles.searchContainer, {
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

interface InputProps extends VariantProps<typeof inputVariants> {
	id?: string;
	name?: string;
	type?: 'search' | 'text';
	placeholder?: string;
	className?: string;
	icon?: React.ReactNode;
	lastIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(props: InputProps, ref) => {
		const {
			id,
			name,
			type = 'text',
			placeholder,
			icon,
			lastIcon,
			className,
			variant,
			size,
		} = props;

		return (
			<label
				htmlFor={id}
				className={cn(
					inputVariants({ variant, size, className }),
					className
				)}
			>
				{icon && <div>{icon}</div>}
				<input
					type={type}
					id={id}
					ref={ref}
					name={name}
					placeholder={placeholder}
				/>
				{lastIcon && <div>{lastIcon}</div>}
			</label>
		);
	}
);

Input.displayName = 'Input';

export default Input;
