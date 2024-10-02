import {
	ProviderOrderStatus,
	ProviderIdentity,
	OrderStatus,
	SimStatus,
} from '@libs/interfaces';
import { BadRequestException, InternalException } from '@libs/middlewares';
import { AiraloAsyncOrderResponse } from '@libs/providers';
import ProviderOrder, {
	ProviderOrderCreationAttributes,
} from '../db/models/ProviderOrder';
import dbConnect from '../db';
import { Transaction } from 'sequelize';
import Sim, { SimCreationAttributes } from '../db/models/Sims';
import Order from '../db/models/Order';

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
) => {
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
			orderId: updatedProviderOrder.id,
			providerOrderId: updatedProviderOrder.id,
		},
		createdSims: createdSims.map((sim) => ({
			id: sim.id,
			iccid: sim.iccid,
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
		netPrice: data.data['1'].data.net_price,
	};

	// Save the SIMs
	const simData: SimCreationAttributes[] = data.data.sims.map((sim) => ({
		providerOrderId: providerOrder.id,
		iccid: sim.iccid,
		lpa: sim.lpa,
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
		remaining: 0,
		total: 0,
		expiredAt: new Date(),
		isUnlimited: false,
		status: SimStatus.NOT_ACTIVE,
		remainingVoice: 0,
		remainingText: 0,
		totalVoice: 0,
		totalText: 0,
	}));

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
