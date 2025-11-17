import { InternalException, NotFoundException } from '@travelpulse/middlewares';
import PaymentAttempt from '../../db/models/PaymentAttempt';
import Order from '../../db/models/Order';
import OrderItem from '../../db/models/OrderItem';
import Package from '../../db/models/Package';
import ProviderOrder from '../../db/models/ProviderOrder';
import {
	OrderStatus,
	PaymentStatus,
	ProviderFactoryData,
} from '@travelpulse/interfaces';
import { processProviderOrders } from '../orders/provider-order.service';
import { Transaction } from 'sequelize';

interface ConfirmPaymentServiceRequest {
	orderId: number;
	userId: number;
	paymentAttemptId: number;
	referenceId: string;
}

/**
 *
 * @param data
 * @param transact
 * @returns
 */
/**
 * Distributes products to the appropriate providers after a successful payment confirmation.
 *
 * This service handles the post-payment workflow including:
 * - Verifying the order and payment attempt exist
 * - Implementing idempotency checks to prevent duplicate processing
 * - Updating payment attempt and order statuses to PAID
 * - Creating provider orders based on order items and package data
 * - Managing all operations within a database transaction for consistency
 *
 * @param data - The payment confirmation request data
 * @param data.orderId - The unique identifier of the order
 * @param data.userId - The unique identifier of the user who made the order
 * @param data.paymentAttemptId - The unique identifier of the payment attempt
 * @param data.referenceId - Optional external payment reference identifier
 * @param transact - The database transaction to ensure atomicity of all operations
 *
 * @returns A promise that resolves to an object containing:
 * - `orderId`: The order identifier
 * - `paymentId`: The payment attempt identifier
 * - `orderStatus`: The updated order status (OrderStatus.PAID)
 * - `paymentStatus`: The updated payment status (PaymentStatus.PAID)
 * - `providerOrdersCreated`: Boolean indicating if provider orders were newly created
 * - `message`: Optional message (e.g., 'already_confirmed' for idempotent calls)
 *
 * @throws {NotFoundException} When the order or payment attempt is not found
 * @throws {InternalException} When package data is missing or provider order processing fails
 *
 * @remarks
 * - This function commits or rolls back the transaction based on success or failure
 * - Idempotency is guaranteed: subsequent calls with the same data will return success without reprocessing
 * - All database operations are performed within the provided transaction for consistency
 */
export const distributeProductService = async (
	data: ConfirmPaymentServiceRequest,
	transact: Transaction
) => {
	const { orderId, userId, paymentAttemptId, referenceId } = data;

	// Load Order and PaymentAttempt within the same transaction
	const [order, paymentAttempt] = await Promise.all([
		Order.findOne({
			where: { id: orderId, userId },
			transaction: transact,
		}),
		PaymentAttempt.findOne({
			where: { id: paymentAttemptId, orderId, userId },
			transaction: transact,
		}),
	]);

	if (!order) {
		throw new NotFoundException(`Order not found: ${orderId}`, null);
	}

	if (!paymentAttempt) {
		throw new NotFoundException(
			`Payment attempt not found: ${paymentAttemptId}`,
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
					orderItemId: item.id,
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
			orderStatus: OrderStatus.PAID,
			paymentStatus: PaymentStatus.PAID,
			providerOrdersCreated: true,
		} as const;
	} catch (error) {
		await transact.rollback();
		// Ensure states remain consistent using the transaction rollback
		throw new InternalException('Failed to confirm payment', error);
	}
};
