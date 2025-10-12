import { OrderDetailResponse, OrderStatus } from '@travelpulse/interfaces';

export function constructTimeline(order: OrderDetailResponse) {
	const base = [
		{
			title: 'Order Placed',
			subtitle: 'Order received',
			at: order?.createdAt,
		},
	];

	const up = String(order?.status ?? '').toUpperCase();
	if (up.includes('PROCESS'))
		base.push({
			title: 'Order Processed',
			subtitle: 'Preparing items',
			at: order?.createdAt,
		});
	if (up === 'PAID' || up === 'COMPLETED')
		base.push({
			title: 'Payment Confirmed',
			subtitle: 'Payment verified',
			at: order?.createdAt,
		});
	if (up === 'PAYMENT_FAILED')
		base.push({
			title: 'Payment Failed',
			subtitle: 'Retry payment',
			at: order?.createdAt,
		});
	if (up === 'CANCELLED')
		base.push({
			title: 'Order Cancelled',
			subtitle: 'Order was cancelled',
			at: order?.createdAt,
		});
	return base;
}

export function orderNextStepMsg(status: OrderStatus) {
	if (
		status === OrderStatus.PENDING ||
		status === OrderStatus.PROCESSING_PAYMENT
	)
		return 'Awaiting payment confirmation.';

	if (status === OrderStatus.PAID)
		return 'Generating eSIM; you can view your eSIM details.';

	if (status === OrderStatus.COMPLETED) return undefined;

	if (status === OrderStatus.PAYMENT_FAILED)
		return 'Please try paying again.';

	if (status === OrderStatus.CANCELLED) return 'This order was cancelled.';

	return undefined;
}
