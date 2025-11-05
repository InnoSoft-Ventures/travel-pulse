import { Request } from 'express';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestHeaders,
	isAxiosError,
	Method,
} from 'axios';
import { SERVICE, SERVICE_NAME } from './service-urls';
import { ResponseData } from '@travelpulse/interfaces';
import { tokenSigning } from '@travelpulse/middlewares';
import { ServiceDiscovery } from './serviceDiscovery';

type RequestHeaders = Partial<
	AxiosRequestHeaders & {
		'x-service-name': string;
		'service-token': string;
	}
>;

class ApiService {
	private static instance: AxiosInstance;
	private static axiosInstances: { [key in SERVICE]?: AxiosInstance } = {};

	public static request() {
		if (!this.instance) {
			this.instance = axios.create({
				headers: {
					'Content-Type': 'application/json',
				},
				validateStatus: (status) => {
					return status >= 200 && status < 500;
				},
				maxRedirects: 5,
			});
		}

		return this.instance;
	}

	private static async getAxiosInstance(
		service: SERVICE
	): Promise<AxiosInstance> {
		if (!this.axiosInstances[service]) {
			const serviceURL = await ServiceDiscovery.getServiceAddress(
				service
			);

			this.axiosInstances[service] = axios.create({
				baseURL: serviceURL,
				headers: {
					'Content-Type': 'application/json',
				},
				validateStatus: (status) => {
					return status >= 200 && status < 500;
				},
				maxRedirects: 5,
			});

			this.axiosInstances[service]?.interceptors.request.use((config) => {
				config.headers['service-token'] = ApiService.signServiceToken();

				return config;
			});

			this.axiosInstances[service]?.interceptors.response.use(
				(response) => ({
					...response,
					data: { ...response.data, statusCode: response.status },
				}),
				(error: AxiosError) => {
					if (error.response) {
						return Promise.reject(error.response.data);
					}

					return Promise.reject(error);
				}
			);
		}

		return this.axiosInstances[service]!;
	}

	private static signServiceToken() {
		const serviceToken = process.env.SERVICE_COMMUNICATION_TOKEN;

		if (!serviceToken) {
			throw new Error('Service communication token not found!');
		}

		try {
			return `ISC ${tokenSigning({}, serviceToken, {
				expiresIn: '2m',
			})}`;
		} catch (error) {
			console.error('signServiceToken:', error);

			throw new Error('Failed to sign service token');
		}
	}

	public static async requestConfig<Response>(
		service: SERVICE,
		method: Method,
		req: Request,
		url: string,
		payload = {},
		headers?: RequestHeaders
	) {
		try {
			const axiosInstance = await this.getAxiosInstance(service);

			const customHeaders = {
				...headers,
				'x-service-name': process.env.SERVICE_NAME || '',
				authentication: req.headers ? req.headers.authorization : '',
			} as unknown as AxiosRequestHeaders;

			const response = await axiosInstance<ResponseData<Response>>({
				method,
				url: axiosInstance.defaults.baseURL + url,
				data: payload,
				params: req.query,
				headers: customHeaders,
			});

			return Promise.resolve(response.data);
		} catch (error) {
			this.handleError(error);
			return Promise.reject(error);
		}
	}

	private static handleError(err: Error | unknown): void {
		console.error('AxiosInstance:handleError', err);
	}

	public static async get<Response>(
		service: SERVICE,
		req: Request,
		endpoint: string,
		data?: Record<string, string>,
		headers?: RequestHeaders
	): Promise<ResponseData<Response>> {
		return this.requestConfig<Response>(
			service,
			'GET',
			req,
			endpoint,
			data,
			headers
		);
	}

	public static async post<Response>(
		service: SERVICE,
		req: Request,
		endpoint: string,
		data: Record<string, any>,
		headers?: RequestHeaders
	): Promise<ResponseData<Response>> {
		return this.requestConfig<Response>(
			service,
			'POST',
			req,
			endpoint,
			data,
			headers
		);
	}

	public static async put<Response>(
		service: SERVICE,
		req: Request,
		endpoint: string,
		data: Record<string, string>,
		headers?: RequestHeaders
	): Promise<ResponseData<Response>> {
		return this.requestConfig<Response>(
			service,
			'PUT',
			req,
			endpoint,
			data,
			headers
		);
	}

	public static async delete<Response>(
		service: SERVICE,
		req: Request,
		endpoint: string,
		data?: Record<string, string>,
		headers?: RequestHeaders
	): Promise<ResponseData<Response>> {
		return this.requestConfig<Response>(
			service,
			'DELETE',
			req,
			endpoint,
			data,
			headers
		);
	}
}

const APIRequest = ApiService.request();

export {
	ApiService,
	SERVICE_NAME,
	SERVICE,
	APIRequest,
	AxiosError,
	isAxiosError,
};
