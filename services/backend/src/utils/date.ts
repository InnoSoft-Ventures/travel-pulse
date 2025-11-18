import { dateJs } from '@travelpulse/utils';

/**
 * Checks if a token is valid based on its issued time and expiration duration.
 *
 * @param issuedAt - The date and time when the token was issued.
 * @param expiresIn - The duration in seconds for which the token is valid.
 * @param currentTime - The current time in milliseconds since the Unix epoch. Defaults to the current system time.
 * @returns Returns true if the token is still valid, otherwise false.
 */
export function isTokenValid(
	issuedAt: Date,
	expiresIn: number,
	currentTime = Date.now()
): boolean {
	const expiryTime = dateJs(issuedAt).add(expiresIn, 'seconds').valueOf();

	return currentTime < expiryTime;
}

/**
 * Calculates the expiry date by adding a specified number of days to the given start date.
 *
 * @param startDate - The starting date as a string (i.e `2025-08-20 22:54:03`).
 * @param validityDuration - The number of days to add to the start date to determine the expiry date.
 * @returns The calculated expiry date as a JavaScript Date object.
 */
export function calculateExpiryDate(
	startDate: string,
	validityDuration: number
): Date {
	return dateJs(startDate).add(validityDuration, 'days').toDate();
}
