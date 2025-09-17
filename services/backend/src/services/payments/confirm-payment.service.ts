import { InternalException, NotFoundException } from '@travelpulse/middlewares';
import { SessionRequest } from '../../../types/express';
import PaymentAttempt from '../../db/models/PaymentAttempt';
import Order from '../../db/models/Order';
import OrderItem from '../../db/models/OrderItem';
import Package from '../../db/models/Package';
import ProviderOrder from '../../db/models/ProviderOrder';
import dbConnect from '../../db';
import {
	OrderStatus,
	PaymentStatus,
	ProviderFactoryData,
} from '@travelpulse/interfaces';
import { PaymentConfirmationRequest } from '@travelpulse/interfaces/schemas/payment.schema';
import { processProviderOrders } from '../orders/provider-order.service';

/**
 * Confirm a successful payment and create provider orders atomically.
 * Implements idempotency: if already confirmed, does not duplicate provider orders.
 */
export const confirmPaymentService = async (req: SessionRequest) => {
	const { orderId: orderIdParam, paymentId: paymentIdParam } = req.params;
	const orderId = Number(orderIdParam);
	const paymentId = Number(paymentIdParam);
	const { referenceId } = req.body as PaymentConfirmationRequest;

	const transact = await dbConnect.transaction();

	// Load Order and PaymentAttempt within the same transaction
	const [order, paymentAttempt] = await Promise.all([
		Order.findOne({
			where: { id: orderId, userId: req.user.accountId },
			transaction: transact,
		}),
		PaymentAttempt.findOne({
			where: { id: paymentId, orderId },
			transaction: transact,
		}),
	]);

	if (!order) {
		throw new NotFoundException(`Order not found: ${orderId}`, null);
	}

	if (!paymentAttempt) {
		throw new NotFoundException(
			`Payment attempt not found: ${paymentId}`,
			null
		);
	}

	try {
		// Idempotency: if already confirmed (payment succeeded or provider orders exist), short-circuit
		const existingProviderOrders = await ProviderOrder.count({
			where: { orderId },
			transaction: transact,
		});

		const alreadyConfirmed =
			paymentAttempt.status === PaymentStatus.PAID ||
			existingProviderOrders > 0;

		if (alreadyConfirmed) {
			await transact.commit();

			return {
				orderId: order.id,
				paymentId: paymentAttempt.id,
				orderStatus: OrderStatus.PAID,
				paymentStatus: PaymentStatus.PAID,
				providerOrdersCreated: false,
				message: 'already_confirmed',
			} as const;
		}

		// Mark paymentAttempt as PAID and set optional referenceId
		paymentAttempt.status = PaymentStatus.PAID;
		paymentAttempt.referenceId = referenceId;

		await paymentAttempt.save({ transaction: transact });

		// Mark order as PAID.
		order.status = OrderStatus.PAID;

		await order.save({ transaction: transact });

		// Build providerOrderDataPreparation from order items + package data
		const orderItems = await OrderItem.findAll({
			where: { orderId },
			include: [
				{
					model: Package,
					as: 'package',
					attributes: [
						'externalPackageId',
						'provider',
						'type',
						'amount',
						'voice',
						'text',
					],
				},
			],
			transaction: transact,
		});

		const providerOrderDataPreparation: ProviderFactoryData[] =
			orderItems.map((item) => {
				const pkg = item.get('package') as Package | undefined;

				if (!pkg) {
					throw new InternalException(
						`Package not found for order item ${item.id}`,
						null
					);
				}

				return {
					packageId: pkg.externalPackageId,
					provider: pkg.provider as any,
					quantity: item.quantity,
					dataAmount: (pkg.amount ?? 0) as number,
					voice: (pkg.voice ?? 0) as number,
					text: (pkg.text ?? 0) as number,
					type: pkg.type as any,
					startDate: item.startDate,
				};
			});

		// Create provider orders
		await processProviderOrders(
			providerOrderDataPreparation,
			order.id,
			order.currency,
			transact
		);

		await transact.commit();

		return {
			orderId: order.id,
			paymentId: paymentAttempt.id,
			orderStatus: 'paid',
			paymentStatus: 'succeeded',
			providerOrdersCreated: true,
		} as const;
	} catch (error) {
		await transact.rollback();
		// Ensure states remain consistent using the transaction rollback
		throw new InternalException('Failed to confirm payment', error);
	}
};
