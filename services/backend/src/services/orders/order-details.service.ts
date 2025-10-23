import { OrderDetailResponse } from '@travelpulse/interfaces';
import { SessionRequest } from '../../../types/express';
import Order from '../../db/models/Order';
import OrderItem from '../../db/models/OrderItem';
import { dateJs, PRETTY_DATETIME_FORMAT } from '@travelpulse/utils';
import { constructTimeline } from './order-util';

export const getOrdersService = async (
	req: SessionRequest
): Promise<OrderDetailResponse[]> => {
	const userId = req.user.accountId;

	const orders = await Order.findAll({
		where: { userId },
		include: [
			{
				model: OrderItem,
				as: 'orderItems',
			},
		],
		order: [['createdAt', 'DESC']],
	});

	return orders.map((order) => {
		// Construct order timeline
		const timeline = constructTimeline(order);

		const details: OrderDetailResponse = {
			orderId: order.id,
			orderNumber: order.orderNumber,
			totalAmount: order.totalAmount,
			status: order.status,
			currency: order.currency,
			details: order.orderItems.map((detail) => ({
				id: detail.id,
				packageId: detail.packageId,
				quantity: detail.quantity,
				price: detail.price,
				startDate: detail.startDate,
			})),
			createdAt: order.createdAt,
			formattedCreatedAt: dateJs(order.createdAt).format(
				PRETTY_DATETIME_FORMAT
			),
			timeline,
		};

		return details;
	});
};

export const getOrderByIdService = async (
	req: SessionRequest
): Promise<OrderDetailResponse> => {
	const userId = req.user.accountId;
	const orderId = Number(req.params.orderId);

	const order = await Order.findOne({
		where: { id: orderId, userId },
		include: [
			{
				model: OrderItem,
				as: 'orderItems',
			},
		],
	});

	if (!order) {
		const { NotFoundException } = await import('@travelpulse/middlewares');
		throw new NotFoundException('Order not found', { orderId });
	}

	// Construct order timeline
	const timeline = constructTimeline(order);

	return {
		orderId: order.id,
		orderNumber: order.orderNumber,
		totalAmount: order.totalAmount,
		status: order.status,
		currency: order.currency,
		details: order.orderItems.map((detail) => ({
			id: detail.id,
			packageId: detail.packageId,
			quantity: detail.quantity,
			price: detail.price,
			startDate: detail.startDate,
		})),
		createdAt: order.createdAt,
		formattedCreatedAt: dateJs(order.createdAt).format(
			PRETTY_DATETIME_FORMAT
		),
		timeline,
	};
};
