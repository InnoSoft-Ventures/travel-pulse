'use client';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavLinkProps extends LinkProps {
	children: React.ReactNode;
	isActive?: boolean;
	className?: string;
	partialMatchValue?: string;
	pathIgnorePartialList?: string[];
}

export const NavLink = ({
	children,
	isActive,
	className,
	partialMatchValue,
	pathIgnorePartialList,
	...rest
}: NavLinkProps) => {
	const pathName = usePathname();
	let active = isActive || pathName === rest.href;

	if (partialMatchValue && pathName.includes(partialMatchValue)) {
		active = true;
	}

	if (pathIgnorePartialList) {
		for (const ignorePath of pathIgnorePartialList) {
			if (pathName.includes(ignorePath)) {
				active = false;
				break;
			}
		}
	}

	return (
		<Link {...rest} className={className} data-active={active}>
			{children}
		</Link>
	);
};
