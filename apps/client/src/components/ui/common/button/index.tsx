import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './button.module.scss';
import { cn } from '../../../../lib/utils';

const buttonVariants = cva(styles.btn, {
	variants: {
		variant: {
			default: styles.default,
			outline: styles.outline,
			secondary: styles.secondary,
			link: styles.link,
		},
		size: {
			default: styles.defaultSize,
			sm: styles.smallSize,
			lg: styles.largeSize,
			icon: 'h-10 w-10',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;
	icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, loading = false, icon, children, ...props },
		ref
	) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{loading && <div>Loading</div>}
				{icon && <span className={styles.icon}>{icon}</span>}

				{!loading && <div className={styles.content}>{children}</div>}
			</button>
		);
	}
);
Button.displayName = 'Button';

export { Button };
