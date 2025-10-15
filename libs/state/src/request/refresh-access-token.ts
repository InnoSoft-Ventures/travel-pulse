import axios, { AxiosResponse } from 'axios';
// import { BASE_API_URL } from './config';

let refreshPromise: Promise<AxiosResponse<string> | null> | null = null;
let refreshing = false;

export async function refreshAccessToken(): Promise<AxiosResponse<string> | null> {
	if (refreshing && refreshPromise) return refreshPromise;
	refreshing = true;

	// Use a bare axios instance to avoid interceptors recursion
	const bare = axios.create({
		// baseURL: BASE_API_URL,
		withCredentials: true,
		timeout: 10000,
	});

	const promise: Promise<AxiosResponse<string> | null> = bare
		.post<string>('/api/auth/refresh')
		.then((res) => res)
		.catch((error) => {
			console.error('Failed to refresh access token', error);
			return null;
		})
		.finally(() => {
			refreshing = false;
			refreshPromise = null;
		});

	refreshPromise = promise;
	return promise;
}
