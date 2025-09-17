import axios, { AxiosError } from 'axios';
import { BASE_API_URL } from './config';
import { logoutUser } from '../thunks/auth.thunk';
import { storeRef } from '@travelpulse/state';

const axiosInstance = axios.create({
	baseURL: BASE_API_URL,
	timeout: 5000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	validateStatus: function (status) {
		return status !== 401 && status >= 200 && status < 500;
	},
});

// Interceptor to attach the authorization token
axiosInstance.interceptors.request.use((config) => {
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => ({
		...response,
		data: { ...response.data, statusCode: response.status },
	}),
	(error: AxiosError) => {
		console.error('API Error:', error);

		if (error.response && error.response.status === 401) {
			console.log('Unauthorized access - refreshing token...');
			// Dispatch logout which clears session and redirects appropriately
			try {
				const store = storeRef.get();
				if (store) {
					// fire and forget
					store.dispatch<any>(logoutUser({}));
				}
			} catch {}

			const { data, status } = error.response as any;
			return Promise.reject({ ...(data || {}), statusCode: status });
		}

		if (error.response) {
			const { data, status } = error.response as any;
			return Promise.reject({ ...(data || {}), statusCode: status });
		}

		return Promise.reject(error);
	}
);

const ApiService = axiosInstance;

export { ApiService };
