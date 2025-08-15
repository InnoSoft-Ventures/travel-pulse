import {
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
		const order = await Order.findByPk(orderId);

		if (!order) {
			throw new InternalException(`Order not found: ${orderId}`, null);
		}

		const attempt = await PaymentAttempt.create(
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

		await transact.commit();

		return {
			attemptId: attempt.id,
			status: attempt.status,
			amount: attempt.amount,
			currency: attempt.currency,
			provider: attempt.provider,
			method: attempt.method,
		};
	} catch (error) {
		console.error('Failed to create payment attempt:', error);
		await transact.rollback();
		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
