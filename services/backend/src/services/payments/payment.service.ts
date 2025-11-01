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
import {
	ChargeAuthorization,
	PaymentAttemptRequest,
} from '@travelpulse/interfaces/schemas';
import dbConnect from '../../db';
import Order from '../../db/models/Order';
import { updateOrderStatus } from '../orders/order-util';
import { getOrThrowPaymentProviderAdapter } from '@travelpulse/services/payment-providers/registry';
import PaymentCard from '../../db/models/PaymentCard';
import User from '../../db/models/User';

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

		const adapter = getOrThrowPaymentProviderAdapter(provider);

		if (adapter.initOneTimePayment) {
			const sessionData = await adapter.initOneTimePayment({
				order: {
					orderId: order.id,
					totalAmount: order.totalAmount,
					orderNumber: order.orderNumber,
				},
				currency,
				userId,
				method,
				paymentAttemptId: paymentAttempt.id,
				email,
			});

			if (sessionData) session = sessionData;
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

/**
 * Charge authorization for a payment attempt.
 * @param paymentAttempt
 */
export const chargePaymentCardService = async (
	req: SessionRequest
): Promise<boolean> => {
	const { accountId: userId } = req.user;
	const { paymentCardId } = req.body as ChargeAuthorization;
	const { paymentId, orderId } = req.params;

	const transact = await dbConnect.transaction();

	try {
		// Find payment attempt
		const paymentAttempt = await PaymentAttempt.findOne({
			where: {
				orderId,
				id: paymentId,
				userId: userId,
			},
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['email'],
					required: true,
				},
			],
		});

		if (!paymentAttempt) {
			throw new InternalException(
				`Payment attempt not found: ${paymentId}`,
				null
			);
		}

		// Get authorization code from saved card
		const savedCard = await PaymentCard.findOne({
			where: {
				id: paymentCardId,
				userId: userId,
			},
		});

		if (!savedCard) {
			throw new InternalException(
				`Saved card not found: ${paymentCardId}`,
				null
			);
		}

		const adapter = getOrThrowPaymentProviderAdapter(
			paymentAttempt.provider
		);

		if (!adapter.chargePaymentCard) {
			throw new InternalException(
				`Charge payment card not supported for provider: ${paymentAttempt.provider}`,
				null
			);
		}

		const response = await adapter.chargePaymentCard({
			authorizationCode: savedCard.authorizationCode,
			currency: paymentAttempt.currency,
			order: {
				orderId: paymentAttempt.orderId,
				totalAmount: paymentAttempt.amount,
			},
			userId,
			paymentAttemptId: paymentAttempt.id,
			email: paymentAttempt.user?.email || '',
		});

		if (!response || !response?.providerReference) {
			throw new InternalException(
				`Failed to charge payment card for attempt: ${paymentAttempt.id}`,
				null
			);
		}

		return true;
	} catch (error) {
		console.error('Failed to charge payment card:', error);

		await transact.rollback();
		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
