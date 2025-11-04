import { InternalException } from '@travelpulse/middlewares';
import dbConnect from '../../db';
import Order from '../../db/models/Order';
import OrderItem, {
	OrderItemCreationAttributes,
} from '../../db/models/OrderItem';
import {
	OrderResponse,
	OrderStatus,
	ProviderFactoryData,
	SOMETHING_WENT_WRONG,
} from '@travelpulse/interfaces';
import Package, { PackageLite } from '../../db/models/Package';
import { CreateOrderPayload } from '@travelpulse/interfaces/schemas';
import { Op, Transaction } from 'sequelize';
import { SessionRequest } from '../../../types/express';
import { toDecimalPoints } from '@travelpulse/utils';
import { generateOrderNumber } from '../../utils/generate-order-number';

type ProviderOrderSeed = Omit<ProviderFactoryData, 'orderItemId'>;

const fetchPackages = async (
	packageQuantityMap: Map<number, number>,
	transact: Transaction
): Promise<Map<number, PackageLite>> => {
	console.log('Fetching packages');

	const packageIds = Array.from(packageQuantityMap.keys());

	if (!packageIds?.length) return new Map();

	const packages = await Package.findAll({
		where: {
			id: {
				[Op.in]: packageIds,
			},
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
		transaction: transact,
	});

	const results = new Map<number, PackageLite>();

	for (const pkg of packages) {
		const plainPkg = pkg.get({ plain: true }) as Omit<
			PackageLite,
			'quantity'
		>;

		const quantity = packageQuantityMap.get(Number(pkg.id));

		if (quantity) {
			results.set(Number(pkg.id), { ...plainPkg, quantity });
		}
	}

	return results;
};

const prepareOrderDetails = (
	data: CreateOrderPayload['packages'],
	reducePackage: Map<number, PackageLite>,
	orderId: number
) => {
	let totalAmount = 0;
	const orderDetails: OrderItemCreationAttributes[] = [];
	const providerOrderSeeds: ProviderOrderSeed[] = [];

	for (const item of data) {
		const packageData = reducePackage.get(Number(item.packageId));

		if (!packageData) {
			throw new InternalException('Package not found', null);
		}

		totalAmount += packageData.price * item.quantity;

		orderDetails.push({
			orderId,
			packageId: Number(item.packageId),
			quantity: item.quantity,
			price: packageData.price,
			startDate: item.startDate,
		});

		providerOrderSeeds.push({
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

	return {
		totalAmount: toDecimalPoints<number>(totalAmount),
		orderDetails,
		providerOrderSeeds,
	};
};

export const createOrderService = async (
	req: SessionRequest
): Promise<OrderResponse> => {
	const data = req.body as CreateOrderPayload;
	const userId = req.user.accountId;

	const transact = await dbConnect.transaction();

	if (data.packages.length === 0) {
		throw new InternalException('No packages provided', null);
	}

	console.log('Creating order for user:', userId);

	try {
		// Step 1: Create the order entry;.
		const order = await Order.create(
			{
				userId,
				orderNumber: generateOrderNumber(),
				status: OrderStatus.PENDING,
				currency: data.currency,
				totalAmount: 0,
			},
			{ transaction: transact }
		);

		// We need to account for the fact that the packages could be duplicated on data.packages,
		// so we use a Set to filter out duplicate package IDs but we need to count the quantity of each package
		const packageQuantityMap = new Map<number, number>();

		for (const item of data.packages) {
			packageQuantityMap.set(
				Number(item.packageId),
				(packageQuantityMap.get(Number(item.packageId)) || 0) +
					item.quantity
			);
		}

		// Step 2: Fetch package details
		const reducePackage = await fetchPackages(packageQuantityMap, transact);

		// Step 3: Prepare order details
		const { totalAmount, orderDetails, providerOrderSeeds } =
			prepareOrderDetails(data.packages, reducePackage, order.id);

		// Step 4: Create order items
		const createdOrderItems = await OrderItem.bulkCreate(orderDetails, {
			transaction: transact,
			returning: true,
		});

		console.log('Order items created');

		const providerOrderDataPreparation: ProviderFactoryData[] =
			createdOrderItems.map((orderItem, index) => {
				const seed = providerOrderSeeds[index];

				if (!seed) {
					throw new InternalException(
						'Provider order preparation mismatch',
						null
					);
				}

				return {
					orderItemId: orderItem.id,
					...seed,
				};
			});

		if (providerOrderDataPreparation.length !== providerOrderSeeds.length) {
			throw new InternalException(
				'Failed to prepare provider orders',
				null
			);
		}

		// Step 4: Update order total amount
		await order.update({ totalAmount }, { transaction: transact });

		console.log('Order total amount updated');

		await transact.commit();

		return {
			orderId: order.id,
			orderNumber: order.orderNumber,
			status: order.status,
			total: order.totalAmount,
			currency: order.currency,
		};
	} catch (error) {
		console.error('Failed to create order:', error);
		await transact.rollback();
		throw new InternalException(SOMETHING_WENT_WRONG, error);
	}
};
