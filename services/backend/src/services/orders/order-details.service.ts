import { OrderDetailResponse } from '@travelpulse/interfaces';
import { SessionRequest } from '../../../types/express';
import Order from '../../db/models/Order';
import OrderItem from '../../db/models/OrderItem';
import { dateJs, PRETTY_DATETIME_FORMAT } from '@travelpulse/utils';
import { constructTimeline } from './order-util';
import Sim from '../../db/models/Sims';
import { NotFoundException } from '@travelpulse/middlewares';

export const getOrdersService = async (
	req: SessionRequest
): Promise<OrderDetailResponse[]> => {
	const userId = req.user.accountId;

	const orders = await Order.findAll({
		where: { userId },
		attributes: [
			'id',
			'orderNumber',
			'totalAmount',
			'status',
			'currency',
			'createdAt',
		],
		include: [
			{
				model: OrderItem,
				as: 'orderItems',
				attributes: [
					'id',
					'packageId',
					'quantity',
					'price',
					'startDate',
				],
				include: [
					{
						model: Sim,
						as: 'sim',
						attributes: ['id', 'name'],
						required: false,
					},
				],
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
				sim: detail.sim
					? {
							id: detail.sim.id,
							name: detail.sim.name || '',
						}
					: undefined,
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
		attributes: [
			'id',
			'orderNumber',
			'totalAmount',
			'status',
			'currency',
			'createdAt',
		],
		include: [
			{
				model: OrderItem,
				as: 'orderItems',
				attributes: [
					'id',
					'packageId',
					'quantity',
					'price',
					'startDate',
				],
				include: [
					{
						model: Sim,
						as: 'sim',
						attributes: ['id', 'name'],
						required: false,
					},
				],
			},
		],
	});

	if (!order) {
		throw new NotFoundException('Order not found', { orderId });
	}

	// Construct order timeline
	const timeline = constructTimeline(order);

	const data: OrderDetailResponse = {
		orderId: order.id,
		orderNumber: order.orderNumber,
		totalAmount: order.totalAmount,
		status: order.status,
		currency: order.currency,
		details: order.orderItems.map((detail) => ({
			id: detail.id,
			sim: detail.sim
				? {
						id: detail.sim.id,
						name: detail.sim.name || '',
					}
				: undefined,
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

	return data;
};
