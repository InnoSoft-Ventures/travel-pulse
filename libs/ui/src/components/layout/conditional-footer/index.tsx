'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '../footer';

export function ConditionalFooter() {
	const pathname = usePathname();

	if (pathname.startsWith('/app')) {
		return null;
	}

	return <Footer />;
}
