import { toast } from './toast';

/** Capitalizes the first letter of a string *
 */
export function capitalizeFirstLetter(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getEnv = (key: string, fallback?: string) => {
	// @ts-ignore
	return process.env[key] ?? fallback ?? '';
};

export function copyUtil(value: string, message: string) {
	if (!value) return;

	navigator.clipboard.writeText(String(value));

	toast.success({
		title: 'Copied',
		description: message,
	});
}

/**
 * Convert data size in megabytes to a human-readable format
 * @param megabytes - Size in megabytes
 * @returns Formatted size string
 */
export function formatDataSize(megabytes: number): string {
	if (megabytes < 0) return '0 MB';
	const units = ['MB', 'GB', 'TB', 'PB'];
	let index = 0;
	let size = megabytes;

	while (size >= 1024 && index < units.length - 1) {
		size /= 1024;
		index++;
	}

	const formattedSize = size % 1 === 0 ? size.toFixed(0) : size.toFixed(2);
	return `${formattedSize} ${units[index]}`;
}
