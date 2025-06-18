export interface SuccessResponse<Result> {
	/** Indicates if the request was successful */
	success: true;
	/** HTTP status code */
	statusCode?: number;
	/** Error message */
	message: string;
	/** Result data */
	data: Result;
}

export interface ValidationIssue {
	message: string;
	field: string;
}

export interface ValidationError {
	issues: ValidationIssue[];
	name: string;
}

export interface ApiError {
	code: number;
	message: string;
}

export type ErrorDetails = ValidationError | ApiError | null;

export interface ErrorResponse {
	/** Indicates the request was unsuccessful */
	success: false;
	/** HTTP status code */
	statusCode?: number;
	/** Error message */
	message: string;
	/** Detailed error information */
	errors: ErrorDetails;
}

export type ResponseData<Result> = SuccessResponse<Result> | ErrorResponse;

/** Type guard to check if an object is an ErrorResponse */
export function isErrorResponse(error: unknown): error is ErrorResponse {
	return (
		typeof error === 'object' &&
		error !== null &&
		'success' in error &&
		error.success === false &&
		'message' in error &&
		typeof error.message === 'string' &&
		'errors' in error &&
		(error.errors === null ||
			(typeof error.errors === 'object' &&
				('issues' in error.errors || 'code' in error.errors)))
	);
}
