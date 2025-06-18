import { ErrorResponse, isErrorResponse } from '@travelpulse/interfaces';

export function errorHandler(
	error: any,
	errorMessage?: string
): ErrorResponse | string {
	if (isErrorResponse(error)) {
		return error;
	}

	if (error.message) {
		// If the error has a message, return it
		return error.message;
	}

	// Fallback for any other type of error
	return errorMessage || 'An unexpected error occurred';
}
