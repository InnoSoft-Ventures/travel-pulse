import axios, {
	AxiosResponse,
	AxiosError,
	AxiosRequestConfig,
	isAxiosError,
} from 'axios';

const RequestService = (token?: string) => {
	// if local then baseURL = 'http://localhost:3000' otherwise get from service discovery
	const baseURL = 'http://localhost:3000';

	const request = axios.create({
		baseURL,
		timeout: 5000,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			// Cookie: cookieHeader || '',
		},
		withCredentials: true,
		validateStatus(status) {
			return status !== 401 && status >= 200 && status < 500;
		},
		maxRedirects: 5,
	});

	// Set up the request interceptor to include the Authorization header
	request.interceptors.request.use((config) => {
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	return request;
};

const AxiosBare = axios;

export { RequestService, AxiosBare, AxiosError, isAxiosError };
export type { AxiosRequestConfig, AxiosResponse };
