export function determineBaseUrl(url: string) {
	const baseUrl = process.env.WEB_APP_URL || 'http://localhost:3000';

	if (url.startsWith('http')) {
		return url;
	}

	return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
