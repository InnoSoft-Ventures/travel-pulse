'use client';

import * as React from 'react';
import styles from './input.module.scss';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

import EyeClosed from '../../../assets/eye-closed.svg';
import EyeOpened from '../../../assets/eye-opened.svg';

const inputVariants = cva(styles.inputContainer, {
	variants: {
		variant: {
			default: styles.default,
			primary: styles.primary,
			secondary: styles.secondary,
		},
		size: {
			default: styles.defaultSize,
			large: styles.largeSize,
		},
		radius: {
			sm: styles.radiusSm,
			md: styles.radiusMd,
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
		radius: 'md',
	},
});

export interface InputProps
	extends Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			'size' | 'className'
		>,
		VariantProps<typeof inputVariants> {
	inputClassName?: string;
	containerClassName?: string;
	label?: string;
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
		radius,
		error,
		label,
		disabled,
		...rest
	} = props;

	const [showPassword, setShowPassword] = React.useState(false);

	const inputType = type === 'password' && showPassword ? 'text' : type;

	return (
		<div className={cn(styles.container, containerClassName)}>
			<div className={styles.inputWrapper}>
				{label && (
					<label className={styles.label} htmlFor={id}>
						{label}
					</label>
				)}

				<div
					className={cn(
						inputVariants({ variant, size, radius }),
						inputClassName,
						type === 'password' ? styles.addPadding : ''
					)}
					aria-disabled={disabled}
				>
					{icon && <div>{icon}</div>}
					<input
						type={inputType}
						id={id}
						disabled={disabled}
						ref={ref}
						{...rest}
					/>

					{type !== 'password' && lastIcon && <div>{lastIcon}</div>}

					{type === 'password' && (
						<button
							type="button"
							className={styles.passwordIcon}
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{!showPassword ? <EyeOpened /> : <EyeClosed />}
						</button>
					)}
				</div>
			</div>
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
});

Input.displayName = 'Input';

export { Input };
