// import { BASE_API_URL } from './config';
import { logoutUser } from '../thunks/auth.thunk';
import { setUser } from '../features/user.slice';
import { ResponseData, UserDataDAO } from '@travelpulse/interfaces';
import { storeRef } from '@travelpulse/state';

import {
	RequestService,
	AxiosError,
	AxiosRequestConfig,
} from '@travelpulse/api-service/request';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
	_retry?: boolean;
	skipAuthRefresh?: boolean;
}

type RefreshSubscriber = (success: boolean) => void;

// const cookieStore = cookies();
// const cookieHeader = cookieStore.toString() || undefined;

const axiosInstance = RequestService();

let refreshInProgress = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const subscribeTokenRefresh = (callback: RefreshSubscriber) => {
	refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (success: boolean) => {
	refreshSubscribers.forEach((callback) => {
		try {
			callback(success);
		} catch (err) {
			console.error('Refresh subscriber error:', err);
		}
	});

	refreshSubscribers = [];
};

const performRefresh = async () => {
	const store = storeRef.get();

	const refreshConfig: AxiosRequestConfigWithRetry = {
		withCredentials: true,
		skipAuthRefresh: true,
	};

	const response = await axiosInstance.post<ResponseData<UserDataDAO>>(
		'/api/auth/refresh',
		{},
		refreshConfig
	);

	const payload = response.data as ResponseData<UserDataDAO>;

	if (payload.success === true && store) {
		store.dispatch(setUser(payload.data));
	}

	return response;
};

axiosInstance.interceptors.response.use(
	(response) => ({
		...response,
		data: { ...response.data, statusCode: response.status },
	}),
	async (error: AxiosError) => {
		console.error('API Error:', error);

		const { response } = error;
		const originalRequest = error.config as AxiosRequestConfigWithRetry;

		if (
			response?.status === 401 &&
			!originalRequest?.skipAuthRefresh &&
			!originalRequest?.url?.includes('/api/auth/signin') &&
			!originalRequest?.url?.includes('/api/auth/signup') &&
			!originalRequest?.url?.includes('/api/auth/logout') &&
			!originalRequest?.url?.includes('/api/auth/refresh')
		) {
			if (originalRequest._retry) {
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			if (refreshInProgress) {
				return new Promise((resolve, reject) => {
					subscribeTokenRefresh(async (success) => {
						if (!success) {
							return reject(error);
						}

						try {
							const retryResponse = await axiosInstance(
								originalRequest
							);
							resolve(retryResponse);
						} catch (retryErr) {
							reject(retryErr);
						}
					});
				});
			}

			refreshInProgress = true;

			return new Promise(async (resolve, reject) => {
				subscribeTokenRefresh(async (success) => {
					if (!success) {
						return reject(error);
					}

					try {
						const retryResponse = await axiosInstance(
							originalRequest
						);
						resolve(retryResponse);
					} catch (retryErr) {
						reject(retryErr);
					}
				});

				try {
					await performRefresh();
					notifyRefreshSubscribers(true);
				} catch (refreshErr) {
					console.error('Failed to refresh session:', refreshErr);
					notifyRefreshSubscribers(false);

					try {
						const store = storeRef.get();
						if (store) {
							await store.dispatch<any>(
								logoutUser({ redirectToLoginPage: true })
							);
						}
					} catch (logoutErr) {
						console.error(
							'Failed to logout after refresh error:',
							logoutErr
						);
					}

					reject(refreshErr);
				} finally {
					refreshInProgress = false;
				}
			});
		}

		if (response) {
			const { data, status } = response as any;
			return Promise.reject({ ...(data || {}), statusCode: status });
		}

		return Promise.reject(error);
	}
);

const ApiService = axiosInstance;

export { ApiService };
