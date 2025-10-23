import {
	OrderStatus,
	OrderTimeline,
	OrderTimelineEvent,
} from '@travelpulse/interfaces';
import Order from '../../db/models/Order';
import { Transaction } from 'sequelize';
import { dateJs, PRETTY_DATETIME_FORMAT } from '@travelpulse/utils';

export const updateOrderStatus = async (
	order: Order,
	status: OrderStatus,
	transact: Transaction
) => {
	order.status = status;

	await order.save({ transaction: transact });
};

export function orderNextStepMsg(status: OrderStatus) {
	if (status === OrderStatus.PROCESSING_PAYMENT)
		return 'Awaiting payment confirmation.';

	if (status === OrderStatus.PAID)
		return 'Generating eSIM; you can view your eSIM details.';

	if (status === OrderStatus.COMPLETED)
		return 'Your order is complete. Enjoy your travel!';

	if (status === OrderStatus.PAYMENT_FAILED)
		return 'Please try paying again.';

	if (status === OrderStatus.CANCELLED) return 'This order was cancelled.';

	return undefined;
}

export function constructTimeline(order: Order): OrderTimeline {
	const events: OrderTimelineEvent[] = [
		{
			status: OrderStatus.PENDING,
			datetime: dateJs(order.createdAt).format(PRETTY_DATETIME_FORMAT),
			message: 'Order Placed',
			description: 'Your order has been placed successfully.',
		},
	];

	const up = order.status;
	const updatedAt = dateJs(order.updatedAt).format(PRETTY_DATETIME_FORMAT);

	if (up === OrderStatus.PROCESSING_PAYMENT) {
		events.push({
			status: order.status,
			datetime: updatedAt,
			message: 'Awaiting Payment Confirmation',
			description: 'Waiting for payment to be confirmed.',
		});
	}

	if (up === OrderStatus.PAID) {
		events.push({
			message: 'Payment Confirmed',
			description: 'Payment verified',
			datetime: updatedAt,
			status: order.status,
		});
	}

	if (up === OrderStatus.PAYMENT_FAILED) {
		events.push({
			message: 'Payment Failed',
			description: 'Retry payment',
			datetime: updatedAt,
			status: order.status,
		});
	}

	if (up === OrderStatus.CANCELLED) {
		events.push({
			message: 'Order Cancelled',
			description: 'Order was cancelled',
			datetime: updatedAt,
			status: order.status,
		});
	}

	if (up === OrderStatus.COMPLETED) {
		events.push({
			message: 'Order Completed',
			description: 'Your order is completed',
			datetime: updatedAt,
			status: order.status,
		});
	}

	return {
		events,
		nextStepMessage: orderNextStepMsg(order.status),
	};
}
