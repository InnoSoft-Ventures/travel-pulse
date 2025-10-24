import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';
import styles from './button.module.scss';
import {
	Button as HeroUIButton,
	ButtonProps as HeroUIButtonProps,
} from '@heroui/button';

const buttonVariants = cva(styles.btn, {
	variants: {
		variant: {
			primary: styles.default,
			outline: styles.outline,
			secondary: styles.secondary,
			link: styles.link,
		},
		size: {
			default: styles.defaultSize,
			sm: styles.smallSize,
			lg: styles.largeSize,
			icon: styles.iconSize,
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
	},
});

export interface ButtonProps
	extends VariantProps<typeof buttonVariants>,
		Omit<HeroUIButtonProps, 'variant' | 'size' | 'spinnerPlacement'> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props, ref) => {
		const {
			className,
			variant,
			size,
			isLoading,
			startContent,
			endContent,
			disableRipple,
			children,
			...rest
		} = props;

		return (
			<HeroUIButton
				ref={ref}
				className={cn(buttonVariants({ variant, size }), className)}
				disableRipple={disableRipple}
				isLoading={isLoading}
				startContent={startContent}
				endContent={endContent}
				{...rest}
			>
				{children}
			</HeroUIButton>
		);
	}
);

Button.displayName = 'Button';

export { Button };
