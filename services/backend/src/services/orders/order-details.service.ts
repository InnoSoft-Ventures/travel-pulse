import { OrderDetailResponse } from '@travelpulse/interfaces';
import { SessionRequest } from '../../../types/express';
import Order from '../../db/models/Order';
import OrderItem from '../../db/models/OrderItem';

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
		};

		return details;
	});
};
