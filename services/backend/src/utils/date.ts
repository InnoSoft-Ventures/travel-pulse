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
	const expiryTime = new Date(issuedAt).getTime() + expiresIn * 1000;
	return currentTime < expiryTime;
}
