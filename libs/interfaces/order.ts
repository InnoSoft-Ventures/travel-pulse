import { OrderStatus } from './enums';

export interface OrderResponse {
	orderId: number;
	orderNumber: string;
	status: string;
	total: number;
	currency: string;
}

export interface OrderDetailResponse {
	orderId: number;
	orderNumber: string;
	totalAmount: number;
	status: OrderStatus;
	currency: string;
	details: {
		id: number;
		packageId: number;
		quantity: number;
		price: number;
		startDate: string;
	}[];
	createdAt: Date;
	formattedCreatedAt: string;
}
