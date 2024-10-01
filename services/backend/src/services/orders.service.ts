import { InternalException } from '@libs/middlewares';
import dbConnect from '../db';
import Order from '../db/models/Order';
import OrderItem, { OrderItemCreationAttributes } from '../db/models/OrderItem';
import { OrderStatus, SOMETHING_WENT_WRONG } from '@libs/interfaces';
import Package from '../db/models/Package';
import { OrderPayload } from '../schema/order.schema';
import { Request } from 'express';
import { ProviderFactory, ProviderFactoryData } from '@libs/providers';
import OrderProvider from '../db/models/OrderProvider';
import { Transaction } from 'sequelize';

const packageDetails = async (
	data: OrderPayload['packages'],
	orderId: number,
	transact: Transaction
) => {
	const packages = await Package.findAll({
		where: {
			id: data.map((item) => item.packageId),
		},
		attributes: ['id', 'price', 'type', 'externalPackageId', 'provider'],
	});

	const reducePackage = packages.reduce<Record<number, Package>>(
		(acc, item) => {
			acc[item.id] = item;

			return acc;
		},
		{}
	);

	let totalAmount = 0;
	let packageList: OrderItemCreationAttributes[] = [];
	let providerOrderDataPreparation: ProviderFactoryData[] = [];

	for (const item of data) {
		const packageData = reducePackage[item.packageId];

		if (!packageData) {
			throw new InternalException('Package not found', null);
		}

		// Calculate total amount
		totalAmount = packageData.price * item.quantity;

		packageList.push({
			orderId,
			packageId: item.packageId,
			quantity: item.quantity,
			price: packageData.price,
			startDate: item.startDate,
		});

		providerOrderDataPreparation.push({
			packageId: packageData.externalPackageId,
			provider: packageData.provider,
			quantity: item.quantity,
			type: packageData.type,
			startDate: item.startDate,
		});
	}

	// Provider Order processing
	const provider = new ProviderFactory(providerOrderDataPreparation, orderId);

	const providerOrders = await provider.processOrder();

	// Saving provider orders and assign order id to each provider order
	const providerOrderList = providerOrders.map((item) => ({
		...item,
		orderId,
	}));

	await OrderProvider.bulkCreate(providerOrderList, {
		transaction: transact,
	});

	return {
		totalAmount,
		packages: packageList,
	};
};

export const createOrderService = async (req: Request) => {
	const data = req.body as OrderPayload;

	const userId = 1;
	const transact = await dbConnect.transaction();

	try {
		const order = await Order.create(
			{
				userId,
				status: OrderStatus.PENDING,
				totalAmount: 0,
			},
			{
				transaction: transact,
			}
		);

		const details = await packageDetails(data.packages, order.id, transact);

		// Creating order items
		await OrderItem.bulkCreate(details.packages, {
			transaction: transact,
		});

		// Update order total amount
		await order.update(
			{
				totalAmount: details.totalAmount,
			},
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
