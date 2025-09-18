import {
	isValidPaymentMethod,
	OrderStatus,
	PaymentAttemptResponse,
	PaymentProvider,
	PaymentStatus,
	SOMETHING_WENT_WRONG,
} from '@travelpulse/interfaces';
import PaymentAttempt from '../../db/models/PaymentAttempt';
import { SessionRequest } from '../../../types/express';
import { InternalException } from '@travelpulse/middlewares';
import { PaymentAttemptRequest } from '@travelpulse/interfaces/schemas';
import dbConnect from '../../db';
import Order from '../../db/models/Order';
import { updateOrderStatus } from '../orders/order-util';
import { getOrThrowPaymentProviderAdapter } from '@travelpulse/services/payment-providers/registry';

/**
 * Create payment attempt for an order.
 * @returns
 */
export const createPaymentAttemptService = async (
	req: SessionRequest
): Promise<PaymentAttemptResponse> => {
	const transact = await dbConnect.transaction();

	try {
		const { currency, provider, method } =
			req.body as PaymentAttemptRequest;

		const orderId = Number(req.params.orderId);
		const { accountId: userId, email } = req.user;

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

		let session: PaymentAttemptResponse['session'];
		try {
			const adapter = getOrThrowPaymentProviderAdapter(provider);
			if (adapter.initOneTimePayment) {
				const sessionData = await adapter.initOneTimePayment({
					order: {
						orderId: order.id,
						totalAmount: order.totalAmount,
					},
					currency,
					userId,
					method,
					paymentAttemptId: paymentAttempt.id,
					email,
				});
				if (sessionData) session = sessionData;
			}
		} catch (e) {
			console.error('Provider session init failed:', e);
		}

		// Save provider payment reference
		if (session) {
			if (session.providerReference)
				paymentAttempt.referenceId = session.providerReference;

			if (session.redirectUrl)
				paymentAttempt.redirectUrl = session.redirectUrl;

			if (session.metadata) paymentAttempt.metadata = session.metadata;

			await paymentAttempt.save({ transaction: transact });
		}

		await transact.commit();

		return {
			paymentId: paymentAttempt.id,
			orderId: orderId,
			status: paymentAttempt.status,
			amount: paymentAttempt.amount,
			currency: paymentAttempt.currency,
			provider: paymentAttempt.provider,
			method: paymentAttempt.method,
			session,
		};
	} catch (error) {
		console.error('Failed to create payment attempt:', error);
		await transact.rollback();
		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
