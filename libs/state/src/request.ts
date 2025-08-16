import axios, { AxiosError } from 'axios';

// Define your API base URL
const baseURL = 'http://localhost:4000/';

const axiosInstance = axios.create({
	baseURL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	validateStatus: function (status) {
		// Resolve only if the status code is less than 500
		return status < 500;
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

		if (error.response) {
			return Promise.reject(error.response.data);
		}

		return Promise.reject(error);
	}
);

const ApiService = axiosInstance;

export { ApiService };
