import { OrderStatus } from '@travelpulse/interfaces';
import Order from '../../db/models/Order';
import { Transaction } from 'sequelize';

export const updateOrderStatus = async (
	order: Order,
	status: OrderStatus,
	transact: Transaction
) => {
	order.status = status;

	await order.save({ transaction: transact });
};
