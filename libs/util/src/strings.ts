/** Capitalizes the first letter of a string *
 */
export function capitalizeFirstLetter(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getEnv = (key: string, fallback?: string) =>
	process.env[key] ?? fallback ?? '';
