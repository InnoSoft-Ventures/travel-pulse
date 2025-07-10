import {
	ErrorHandler,
	ErrorResponse,
	ValidationError,
} from '@travelpulse/interfaces';

/** Type guard to check if an object is an ErrorResponse */
function isErrorResponse(error: unknown): error is ErrorResponse {
	return (
		typeof error === 'object' &&
		error !== null &&
		'success' in error &&
		(error as any).success === false &&
		'message' in error &&
		typeof (error as any).message === 'string' &&
		'errors' in error
	);
}

/** Utility to format API error payloads into a user-friendly string */
export function formatApiErrorDescription(error: ErrorHandler): string {
	if (typeof error === 'string') {
		return error;
	}
	if (isErrorResponse(error)) {
		const details = error.errors;
		if (
			details &&
			typeof details === 'object' &&
			'issues' in details &&
			Array.isArray((details as ValidationError).issues) &&
			(details as ValidationError).issues.length > 0
		) {
			// Format each issue as "field: message"
			return (details as ValidationError).issues
				.map((issue: any) =>
					issue.field
						? `${issue.field}: ${issue.message}`
						: issue.message
				)
				.join('\n');
		}
		// Fallback to top-level message
		if (typeof error.message === 'string') {
			return error.message;
		}
	}
	return 'An unknown error occurred.';
}
