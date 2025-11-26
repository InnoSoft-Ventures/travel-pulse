import {
	ProviderOrderStatus,
	ProviderIdentity,
	OrderStatus,
	SimStatus,
} from '@travelpulse/interfaces';
import {
	BadRequestException,
	InternalException,
} from '@travelpulse/middlewares';
import { AiraloAsyncOrderResponse } from '@travelpulse/providers';
import ProviderOrder, {
	ProviderOrderCreationAttributes,
} from '../db/models/ProviderOrder';
import dbConnect from '../db';
import { Transaction } from 'sequelize';
import Sim, { SimCreationAttributes } from '../db/models/Sims';
import Order from '../db/models/Order';
import OrderItem from '../db/models/OrderItem';
import User from '../db/models/User';
import { sendOrderConfirmationEmail } from '@travelpulse/services';
import Package from '../db/models/Package';
import Operator from '../db/models/Operator';
import Country from '../db/models/Country';
import Continent from '../db/models/Continent';
import { orderMetaUtil } from '@travelpulse/providers/util';
import { PackageActionType } from '../db/models/PackageHistory';
import { createPackageHistoryRecord } from './package-history.service';

interface ProcessedOrder {
	updatedProviderOrder: {
		orderId: number;
		providerOrderId: number;
	};
	createdSims: {
		id: number;
		iccid: string;
		msisdn: string | null;
	}[];
}

/**
 * Fetches the provider order by external request ID and provider.
 * @param externalRequestId - The external request ID.
 * @param provider - The provider identity.
 * @param transact - The transaction object.
 * @returns The found provider order.
 */
const findProviderOrder = async (
	externalRequestId: string,
	provider: ProviderIdentity,
	transact: Transaction
) => {
	const record = await ProviderOrder.findOne({
		where: { externalRequestId, provider },
		transaction: transact,
	});

	if (!record) {
		throw new BadRequestException('Order provider not found', null);
	}

	return record;
};

/**
 * Create SIM name
 */
async function createSimName(
	packageId: string,
	provider: ProviderIdentity,
	providerOrderId: number
) {
	const packageInfo = await Package.findOne({
		where: {
			externalPackageId: packageId,
			provider,
		},
		attributes: ['day', 'data'],
		include: [
			{
				model: Operator,
				as: 'operator',
				include: [
					{
						model: Country,
						as: 'country',
						attributes: ['name'],
						required: false,
					},
					{
						model: Continent,
						as: 'continent',
						attributes: ['name'],
						required: false,
					},
				],
			},
		],
	});

	if (packageInfo) {
		const countryName =
			packageInfo.operator?.country?.name ||
			packageInfo.operator?.continent?.name ||
			'Unknown Region';

		return `${countryName} - ${packageInfo.data} for ${packageInfo.day} days`;
	}

	return `Package #${providerOrderId}`;
}

/**
 * Saves the provider order and associated SIMs in a single transaction.
 * @param providerOrder - The provider order.
 * @param providerOrderData - The data for updating the provider order.
 * @param simData - The SIMs data to be created.
 * @param transact - The transaction object.
 * @returns The updated provider order and created SIMs.
 */
const saveOrderProducts = async (
	providerOrder: ProviderOrder,
	providerOrderData: ProviderOrderCreationAttributes,
	simData: SimCreationAttributes[],
	transact: Transaction
): Promise<ProcessedOrder> => {
	const [updatedProviderOrder, createdSims] = await Promise.all([
		providerOrder.update(providerOrderData, {
			transaction: transact,
		}),
		Sim.bulkCreate(simData, {
			transaction: transact,
		}),
	]);

	return {
		updatedProviderOrder: {
			orderId: updatedProviderOrder.orderId,
			providerOrderId: updatedProviderOrder.id,
		},
		createdSims: createdSims.map((sim) => ({
			id: sim.id,
			iccid: sim.iccid,
			msisdn: sim.msisdn,
		})),
	};
};

const updateOrderItemSimMapping = async (
	orderItemId: number | undefined,
	sims: { iccid?: string | null }[] | undefined,
	transact: Transaction
) => {
	if (!orderItemId || !sims || sims.length === 0) {
		return;
	}

	const normalizedOrderItemId = Number(orderItemId);

	if (!Number.isInteger(normalizedOrderItemId)) {
		return;
	}

	const iccid = sims.find((sim) => sim.iccid)?.iccid;

	if (!iccid) {
		return;
	}

	await OrderItem.update(
		{ iccid },
		{
			where: { id: normalizedOrderItemId },
			transaction: transact,
		}
	);
};

function extractTextAndVoice(webhook: Record<string, any>) {
	// Iterate only over keys "0" and "1" (or any that exist)
	for (const key of Object.keys(webhook)) {
		const entry = webhook[key];

		// Look for structure matching { data: { text, voice } }
		if (entry && typeof entry === 'object' && entry.data) {
			const { text, voice } = entry.data;

			return {
				text: text ?? null,
				voice: voice ?? null,
			};
		}
	}

	// Nothing found
	return { text: null, voice: null };
}

/**
 * Processes an Airalo order asynchronously.
 * @param data - The async order response data.
 * @param transact - The transaction object.
 * @returns The processed provider order and SIMs.
 */
const processAiraloOrder = async (
	data: AiraloAsyncOrderResponse,
	transact: Transaction
) => {
	const providerOrder = await findProviderOrder(
		data.request_id,
		ProviderIdentity.AIRALO,
		transact
	);

	const { text, voice } = extractTextAndVoice(data.data);

	const descriptionObj = orderMetaUtil(data.data.description);
	const description = `${descriptionObj.quantity} x ${descriptionObj.type} - ${descriptionObj.packageId}`;

	const providerOrderData: ProviderOrderCreationAttributes = {
		externalOrderId: data.data.code,
		status: ProviderOrderStatus.COMPLETED,
		currency: data.data.currency,
		packageId: data.data.package_id,
		quantity: data.data.quantity,
		type: data.data.type,
		description,
		esimType: data.data.esim_type,
		validity: data.data.validity,
		package: data.data.package,
		data: data.data.data,
		dataAmount: providerOrder.dataAmount,
		price: data.data.price,
		manualInstallation: data.data.manual_installation,
		qrcodeInstallation: data.data.qrcode_installation,
		installationGuides: data.data.installation_guides,
		text,
		voice,
		netPrice: data.data.net_price,
	};

	await updateOrderItemSimMapping(
		descriptionObj.orderItemId,
		data.data.sims,
		transact
	);

	// Save the SIMs
	const simData: SimCreationAttributes[] = await Promise.all(
		data.data.sims.map(async (sim) => ({
			providerOrderId: providerOrder.id,
			iccid: sim.iccid,
			lpa: sim.lpa,
			name: await createSimName(
				data.data.package_id,
				providerOrder.provider,
				providerOrder.id
			),
			imsis: sim.imsis,
			matchingId: sim.matching_id,
			qrcode: sim.qrcode,
			qrcodeUrl: sim.qrcode_url,
			code: sim.airalo_code,
			apnType: sim.apn_type,
			apnValue: sim.apn_value,
			isRoaming: sim.is_roaming,
			confirmationCode: sim.confirmation_code,
			apn: sim.apn,
			msisdn: sim.msisdn,
			directAppleInstallationUrl: sim.direct_apple_installation_url,
			remaining: providerOrder.dataAmount,
			total: providerOrder.dataAmount,
			isUnlimited: false,
			status: SimStatus.NOT_ACTIVE,
			remainingVoice: text || 0,
			remainingText: voice || 0,
			totalVoice: text || 0,
			totalText: voice || 0,
		}))
	);

	const processedOrder = await saveOrderProducts(
		providerOrder,
		providerOrderData,
		simData,
		transact
	);

	// Calculate expiration date based on validity days
	const validityDays = providerOrderData.validity || 0;
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + validityDays);

	// Create package history records for each SIM
	await Promise.all(
		processedOrder.createdSims.map(async (sim) => {
			await createPackageHistoryRecord(
				{
					simId: sim.id,
					providerOrderId: providerOrder.id,
					actionType: PackageActionType.INITIAL_PURCHASE,
					status: SimStatus.NOT_ACTIVE,
					packageId: data.data.package_id,
					packageName: data.data.package,
					dataAmount: providerOrder.dataAmount,
					voiceAmount: voice || 0,
					textAmount: text || 0,
					validityDays,
					price: Number(data.data.price),
					netPrice: data.data.net_price
						? Number(data.data.net_price)
						: undefined,
					currency: data.data.currency,
					activatedAt: undefined, // Will be set when SIM becomes active
					expiresAt,
				},
				transact
			);
		})
	);

	return processedOrder;
};

/**
 * Gets the order processing function based on the provider.
 * @param provider - The provider identity.
 * @returns The corresponding order processing function.
 */
const getProviderFunction = (provider: ProviderIdentity) => {
	switch (provider) {
		case ProviderIdentity.AIRALO:
			return processAiraloOrder;

		default:
			throw new BadRequestException(
				`Unsupported provider: ${provider}`,
				null
			);
	}
};

async function processOrderConfirmationEmail(
	processedOrder: ProcessedOrder,
	transact: Transaction
) {
	try {
		// Fetch the order with its user (we'll use created SIMs from processedOrder)
		const order = await Order.findByPk(
			processedOrder.updatedProviderOrder.orderId,
			{
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'email', 'firstName', 'lastName'],
						required: true,
					},
					{
						association: 'orderItems',
						include: [
							{
								association: 'package',
								include: [
									{
										association: 'operator',
										include: [{ association: 'country' }],
									},
								],
							},
						],
					},
				],
				transaction: transact,
			}
		);

		if (order && order.user && order.user.email) {
			const user = order.user;

			// Use sims returned by the provider processing step (createdSims)
			const createdSims = processedOrder.createdSims || [];

			const viewOrderUrl = `${process.env.WEB_APP_URL || 'http://localhost:3000'}/app/settings/orders/${order.id}`;

			const orderItems = (order as any).orderItems || [];

			void sendOrderConfirmationEmail(user.email, {
				firstName: user.firstName || 'there',
				lastName: user.lastName || '',
				orderNumber: order.orderNumber,
				totalAmount: Number(order.totalAmount),
				currency: order.currency,
				sims: createdSims,
				orderItems: orderItems.map((item: any) => ({
					planName: item.package?.title || 'eSIM Plan',
					region:
						item.package?.operator?.title ||
						item.package?.operator?.country?.name ||
						'Region unavailable',
					quantity: item.quantity,
					price: Number(item.price),
				})),
				viewOrderUrl,
				supportUrl: process.env.SUPPORT_PORTAL_URL || undefined,
			}).catch((e) =>
				console.error('Failed sending order confirmation email', e)
			);
		}
	} catch (e) {
		console.error('Failed to prepare or send order confirmation email', e);
	}
}

/**
 * Processes async orders for a given provider.
 *
 * Called via webhook handlers when providers send async order status updates.
 * @param provider - The provider identity.
 * @param data - The order data.
 */
export const processAsyncOrders = async (
	provider: ProviderIdentity,
	data: AiraloAsyncOrderResponse
) => {
	const transact = await dbConnect.transaction();

	try {
		const processOrderFunction = getProviderFunction(provider);
		const processedOrder = await processOrderFunction(data, transact);

		await Order.update(
			{
				status: OrderStatus.COMPLETED,
			},
			{
				where: { id: processedOrder.updatedProviderOrder.orderId },
				transaction: transact,
			}
		);

		// Send email to user about order completion and SIM details (best-effort)
		await processOrderConfirmationEmail(processedOrder, transact);

		await transact.commit();
		console.log('Order processed', processedOrder);
	} catch (error) {
		await transact.rollback();

		console.error('Error processing async orders', error);

		if (error instanceof BadRequestException) {
			throw error;
		}

		throw new InternalException('Failed to process async orders', error);
	}
};
