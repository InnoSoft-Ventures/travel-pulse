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
