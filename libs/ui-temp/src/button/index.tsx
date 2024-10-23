import * as React from "react";
import styled, { css } from "styled-components";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";

const defaultStyle = css`
	background-color: #007bff;
	color: white;
	padding: 10px 16px;
	border-radius: 4px;
	border: none;
	cursor: pointer;
	&:hover {
		background-color: #0056b3;
	}
`;

const outlineStyle = css`
	background-color: transparent;
	color: #007bff;
	border: 1px solid #007bff;
	&:hover {
		background-color: rgba(0, 123, 255, 0.1);
	}
`;

const secondaryStyle = css`
	background-color: #6c757d;
	color: white;
	&:hover {
		background-color: #5a6268;
	}
`;

const linkStyle = css`
	background-color: transparent;
	color: #007bff;
	text-decoration: underline;
	border: none;
	&:hover {
		color: #0056b3;
	}
`;

const buttonVariants = cva(styles.btn, {
	variants: {
		variant: {
			default: styles.default,
			outline: styles.outline,
			secondary: styles.secondary,
			link: styles.link,
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "px-3",
			lg: "h-11 px-8",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

// Create a styled-component using the styles and dynamic props for variants
const StyledButton = styled.button<ButtonProps>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 2px;
	font-size: 1rem;
	font-weight: 500;
	transition: background-color 0.3s ease;

	${(props) => {
		switch (props.variant) {
			case "outline":
				return outlineStyle;
			case "secondary":
				return secondaryStyle;
			case "link":
				return linkStyle;
			default:
				return defaultStyle;
		}
	}}

	${(props) => {
		switch (props.size) {
			case "sm":
				return css`
					height: 32px;
					padding: 4px 12px;
				`;
			case "lg":
				return css`
					height: 44px;
					padding: 10px 20px;
				`;
			case "icon":
				return css`
					height: 40px;
					width: 40px;
				`;
			default:
				return css`
					height: 40px;
					padding: 8px 16px;
				`;
		}
	}}
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ variant = "default", size = "default", asChild = false, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<StyledButton
				as={Comp}
				variant={variant}
				size={size}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./button.module.scss";
import { cn } from "../../../lib/utils";

const buttonVariants = cva(styles.btn, {
	variants: {
		variant: {
			default: styles.default,
			outline: styles.outline,
			secondary: styles.secondary,
			link: styles.link,
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "px-3",
			lg: "h-11 px-8",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
