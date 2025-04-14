import { UserSessionData } from '@travelpulse/interfaces';

// Cache Key
const cacheKey = 'user-session';

/**
 * Store user in local storage
 * @param currentUserSession - current user session
 * @returns void
 */
export function storeUserInLocalStorage(
	currentUserSession: UserSessionData
): void {
	localStorage.setItem(cacheKey, JSON.stringify(currentUserSession));
}

/**
 * Get user from local storage
 * If user is not logged in, return user null
 */
export function getUserFromLocalStorage(): UserSessionData | null {
	const currentUserSession = localStorage.getItem(cacheKey);

	if (!currentUserSession) {
		return null;
	}

	return JSON.parse(currentUserSession);
}
