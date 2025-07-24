'use client';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavLinkProps extends LinkProps {
	children: React.ReactNode;
	isActive?: boolean;
	className?: string;
}

export const NavLink = ({
	children,
	isActive,
	className,
	...rest
}: NavLinkProps) => {
	const pathName = usePathname();
	const active = isActive || pathName === rest.href;

	return (
		<Link {...rest} className={className} data-active={active}>
			{children}
		</Link>
	);
};
