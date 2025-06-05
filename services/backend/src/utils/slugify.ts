// Utility to generate a URL-friendly slug from a string
// Handles accents, special characters, spaces, etc.

/**
 * Converts a string to a URL-friendly slug.
 * - Lowercases
 * - Removes accents/diacritics
 * - Replaces spaces and special characters with hyphens
 * - Removes non-alphanumeric characters except hyphens
 *
 * @param {string} text - The input string to slugify
 * @returns {string} The slugified string
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD') // split accented letters into base + diacritic
		.replace(/\p{Diacritic}/gu, '') // remove diacritics
		.replace(/[^\w\s-]/g, '') // remove non-word, non-space, non-hyphen
		.replace(/[\s_]+/g, '-') // replace spaces/underscores with hyphens
		.replace(/-+/g, '-') // collapse multiple hyphens
		.replace(/^-+|-+$/g, ''); // trim hyphens from start/end
}
