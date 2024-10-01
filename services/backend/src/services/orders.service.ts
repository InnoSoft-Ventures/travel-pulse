import { InternalException } from '@libs/middlewares';
import dbConnect from '../db';
import Order from '../db/models/Order';
import OrderItem from '../db/models/OrderItem';
import { OrderStatus, SOMETHING_WENT_WRONG } from '@libs/interfaces';

export const createOrderService = async () => {
	const userId = 1;
	const transact = await dbConnect.transaction();

	try {
		const order = await Order.create(
			{
				userId,
				status: OrderStatus.PENDING,
				totalAmount: 0,
				externalOrderRequestId: '',
			},
			{
				transaction: transact,
			}
		);

		// Creating order items
		await OrderItem.bulkCreate(
			[
				{
					orderId: order.id,
					packageId: 1,
					quantity: 1,
					price: 100,
					startDate: '2021-01-01',
				},
				{
					orderId: order.id,
					packageId: 2,
					quantity: 1,
					price: 200,
					startDate: '2021-01-01',
				},
			],
			{
				transaction: transact,
			}
		);

		// await transact.commit();

		return [];
	} catch (error) {
		transact.rollback();

		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
