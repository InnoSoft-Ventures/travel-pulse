import {
	OrderStatus,
	PaymentProvider,
	PaymentStatus,
	SOMETHING_WENT_WRONG,
} from '@travelpulse/interfaces';
import PaymentAttempt from '../../db/models/PaymentAttempt';
import { SessionRequest } from '../../../types/express';
import { InternalException } from '@travelpulse/middlewares';
import { isValidPaymentMethod } from '../../utils/data';
import { PaymentAttemptRequest } from '../../schema/payment.schema';
import dbConnect from '../../db';
import Order from '../../db/models/Order';
import { updateOrderStatus } from '../orders/order-util';

/**
 * Create payment attempt for an order.
 * @returns
 */
export const createPaymentAttemptService = async (req: SessionRequest) => {
	const transact = await dbConnect.transaction();

	try {
		const { currency, provider, method } =
			req.body as PaymentAttemptRequest;

		const orderId = Number(req.params.orderId);
		const userId = req.user.accountId;

		if (!isValidPaymentMethod<PaymentProvider>(provider, method)) {
			throw new InternalException(
				`Invalid payment method: ${method} for provider: ${provider}`,
				null
			);
		}

		// Find order total amount
		const order = await Order.findOne({
			where: {
				id: orderId,
				userId,
			},
			transaction: transact,
		});

		if (!order) {
			throw new InternalException(`Order not found: ${orderId}`, null);
		}

		const paymentAttempt = await PaymentAttempt.create(
			{
				orderId,
				userId,
				provider,
				method,
				status: PaymentStatus.INITIATED,
				amount: order.totalAmount,
				currency,
			},
			{
				transaction: transact,
			}
		);

		// Update order status
		await updateOrderStatus(
			order,
			OrderStatus.PROCESSING_PAYMENT,
			transact
		);

		await transact.commit();

		return {
			paymentId: paymentAttempt.id,
			orderId: orderId,
			status: paymentAttempt.status,
			amount: paymentAttempt.amount,
			currency: paymentAttempt.currency,
			provider: paymentAttempt.provider,
			method: paymentAttempt.method,
		};
	} catch (error) {
		console.error('Failed to create payment attempt:', error);
		await transact.rollback();
		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
