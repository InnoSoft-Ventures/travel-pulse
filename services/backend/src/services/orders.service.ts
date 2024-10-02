import { InternalException } from '@libs/middlewares';
import dbConnect from '../db';
import Order from '../db/models/Order';
import OrderItem, { OrderItemCreationAttributes } from '../db/models/OrderItem';
import { OrderStatus, SOMETHING_WENT_WRONG } from '@libs/interfaces';
import Package from '../db/models/Package';
import { OrderPayload } from '../schema/order.schema';
import { Request } from 'express';
import { ProviderFactory, ProviderFactoryData } from '@libs/providers';
import ProviderOrder from '../db/models/ProviderOrder';
import { Transaction } from 'sequelize';

const fetchPackages = async (packageIds: number[]) => {
	console.log('Fetching packages');
	const packages = await Package.findAll({
		where: {
			id: packageIds,
		},
		attributes: [
			'id',
			'price',
			'type',
			'amount',
			'voice',
			'text',
			'externalPackageId',
			'provider',
		],
	});

	return packages.reduce<Record<number, Package>>((acc, pkg) => {
		acc[pkg.id] = pkg;
		return acc;
	}, {});
};

const prepareOrderDetails = (
	data: OrderPayload['packages'],
	reducePackage: Record<number, Package>,
	orderId: number
) => {
	let totalAmount = 0;
	const packageList: OrderItemCreationAttributes[] = [];
	const providerOrderDataPreparation: ProviderFactoryData[] = [];

	for (const item of data) {
		const packageData = reducePackage[item.packageId];

		if (!packageData) {
			throw new InternalException('Package not found', null);
		}

		const itemTotal = packageData.price * item.quantity;
		totalAmount += itemTotal;

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
			dataAmount: packageData.amount,
			voice: packageData.voice,
			text: packageData.text,
			type: packageData.type,
			startDate: item.startDate,
		});
	}

	return { totalAmount, packageList, providerOrderDataPreparation };
};

const processProviderOrders = async (
	providerOrderDataPreparation: ProviderFactoryData[],
	orderId: number,
	transact: Transaction
) => {
	console.log('Processing provider orders');
	const provider = new ProviderFactory(providerOrderDataPreparation);
	const providerOrders = await provider.processOrder();

	const providerOrderList = providerOrders.map((item) => ({
		...item,
		orderId,
	}));

	await ProviderOrder.bulkCreate(providerOrderList, {
		transaction: transact,
	});

	console.log('Provider orders processed');
};

export const createOrderService = async (req: Request) => {
	const data = req.body as OrderPayload;
	const userId = 1; // Hardcoded for now
	const transact = await dbConnect.transaction();

	try {
		// Step 1: Create the order entry;.
		const order = await Order.create(
			{
				userId,
				status: OrderStatus.PENDING,
				totalAmount: 0,
			},
			{ transaction: transact }
		);

		// Step 2: Fetch package details
		const reducePackage = await fetchPackages(
			data.packages.map((item) => item.packageId)
		);

		// Step 3: Prepare order details
		const { totalAmount, packageList, providerOrderDataPreparation } =
			prepareOrderDetails(data.packages, reducePackage, order.id);

		console.log('Order details prepared');
		// Step 4: Create order items
		await OrderItem.bulkCreate(packageList, {
			transaction: transact,
		});

		console.log('Order items created');

		// Step 5: Process provider orders
		await processProviderOrders(
			providerOrderDataPreparation,
			order.id,
			transact
		);

		// Step 6: Update order total amount
		await order.update({ totalAmount }, { transaction: transact });

		console.log('Order total amount updated');

		// Commit the transaction
		await transact.commit();

		return order;
	} catch (error) {
		console.error('Failed to create order:', error);
		await transact.rollback();
		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
