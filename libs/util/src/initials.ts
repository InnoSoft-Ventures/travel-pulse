/**
 * Generates initials from first name and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns A string containing the first letter of firstName and lastName in uppercase
 */
export const getInitials = (
	firstName?: string,
	lastName?: string
): string => {
	if (!firstName && !lastName) return '?';

	const firstInitial = firstName?.trim().charAt(0).toUpperCase() || '';
	const lastInitial = lastName?.trim().charAt(0).toUpperCase() || '';

	return `${firstInitial}${lastInitial}`.trim() || '?';
};

/**
 * Generates a consistent color based on a string (e.g., user's name)
 * @param str - Input string to generate color from
 * @returns A hex color code
 */
export const getColorFromString = (str: string): string => {
	if (!str) return '#4d36d0'; // Default purple

	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Generate colors in the purple/blue spectrum for consistency with brand
	const hue = (hash % 60) + 240; // 240-300 range (blue to purple)
	const saturation = 45 + (hash % 25); // 45-70%
	const lightness = 40 + (hash % 20); // 40-60%

	return hslToHex(hue, saturation, lightness);
};

/**
 * Converts HSL color values to hex
 */
function hslToHex(h: number, s: number, l: number): string {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}
