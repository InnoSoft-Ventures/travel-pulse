import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground border-transparent hover:bg-primary/80',
				secondary:
					'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
				outline: 'text-foreground border border-border bg-transparent',
				destructive:
					'bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/80',
				success:
					'bg-emerald-600 text-white border-transparent hover:bg-emerald-700',
				warning:
					'bg-amber-500 text-white border-transparent hover:bg-amber-600',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div
			className={cn(badgeVariants({ variant }), className)}
			{...props}
			aria-label="badge"
		/>
	);
}

export { Badge, badgeVariants };
