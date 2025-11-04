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
import User from '../db/models/User';
import { sendOrderConfirmationEmail } from '@travelpulse/services';
import Package from '../db/models/Package';
import Operator from '../db/models/Operator';
import Country from '../db/models/Country';
import Continent from '../db/models/Continent';

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

	const providerOrderData: ProviderOrderCreationAttributes = {
		externalOrderId: data.data.code,
		status: ProviderOrderStatus.COMPLETED,
		currency: data.data.currency,
		packageId: data.data.package_id,
		quantity: data.data.quantity,
		type: data.data.type,
		description: data.data.description,
		esimType: data.data.esim_type,
		validity: data.data.validity,
		package: data.data.package,
		data: data.data.data,
		dataAmount: providerOrder.dataAmount,
		price: data.data.price,
		manualInstallation: data.data.manual_installation,
		qrcodeInstallation: data.data.qrcode_installation,
		installationGuides: data.data.installation_guides,
		text: data.data['0'].data.text,
		voice: data.data['0'].data.voice,
		netPrice: data.data.net_price,
	};

	// TODO: Update OrderItems with the respective SIM->iccid mapping

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
			remainingVoice: 0,
			remainingText: 0,
			totalVoice: 0,
			totalText: 0,
		}))
	);

	return await saveOrderProducts(
		providerOrder,
		providerOrderData,
		simData,
		transact
	);
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
