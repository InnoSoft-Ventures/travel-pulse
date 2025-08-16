'use client';
import { useSearchParams } from 'next/navigation';

export const useRedirect = () => {
	const searchParams = useSearchParams();

	const redirectUtil = (href: string) => {
		const redirectUrl = searchParams.get('redirect');
		if (redirectUrl) {
			window.location.replace(redirectUrl);
		} else {
			window.location.replace(href);
		}
	};

	return redirectUtil;
};
