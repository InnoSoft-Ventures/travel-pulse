import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import styles from './title.module.scss';
import { cn } from '../../../utils';

const titleVariants = cva(styles.mainTitle, {
	variants: {
		color: {
			primary: styles.defaultColor,
			secondary: styles.secondaryColor,
		},
		dualColor: {
			primary: styles.dualPrimaryColor,
			secondary: styles.dualSecondaryColor,
		},
		size: {
			size16: styles.size16,
			size20: styles.size20,
			size35: styles.size35,
			size40: styles.size40,
			size45: styles.size45,
		},
		position: {
			left: styles.left,
			center: styles.center,
			right: styles.right,
		},
	},
	defaultVariants: {
		color: 'primary',
		size: 'size40',
		position: 'left',
	},
});

interface TitleProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'content'>,
		VariantProps<typeof titleVariants> {
	children: React.ReactNode;
}

/**
 * Render a styled title with various customizable options.
 * It utilizes the `cva` utility to manage class variants for styling.
 *
 * ### Props
 * - `color` (optional): Determines the color scheme of the title.
 *   - Options: `'primary' | 'secondary'`
 *   - Default: `'primary'`
 *
 * - `dualColor` (optional): Determines the dual color scheme of the title.
 *   - Options: `'primary' | 'secondary'`
 *   - Default: `undefined`
 *
 * - `size` (optional): Specifies the size of the title.
 *   - Options: `'size16' | 'size20' | 'size35' | 'size40' | 'size45'`
 *   - Default: `'size40'`
 *
 * - `position` (optional): Specifies the alignment of the title.
 *   - Options: `'left' | 'center' | 'right'`
 *   - Default: `'left'`
 *
 * ## Default Variants
 * - `color`: `'primary'`
 * - `size`: `'size40'`
 * - `position`: `'left'`
 */
const Title = (props: TitleProps) => {
	const { className, color, size, children, position, dualColor, ...rest } =
		props;

	return (
		<div
			className={cn(
				titleVariants({ color, size, dualColor, position }),
				className
			)}
			{...rest}
		>
			{children}
		</div>
	);
};

export { Title };
