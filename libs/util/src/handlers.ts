import {
	ErrorHandler,
	isErrorResponse,
	ItemState,
	ListState,
} from '@travelpulse/interfaces';

export function errorHandler(error: any, errorMessage?: string): ErrorHandler {
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

export const createInitialListState = <T>(): ListState<T> => ({
	list: [],
	status: 'idle',
	error: undefined,
});

export const createInitialItemState = <T>(initialData: T): ItemState<T> => ({
	data: initialData,
	status: 'idle',
	error: undefined,
});
