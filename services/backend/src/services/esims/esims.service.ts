import { NotFoundException } from '@travelpulse/middlewares';
import { SessionRequest } from '../../../types/express';
import { Op } from 'sequelize';
import Sim from '../../db/models/Sims';
import ProviderOrder from '../../db/models/ProviderOrder';
import Order from '../../db/models/Order';
import {
	SIMDetails,
	SIMInfo,
	SIMInfoResponse,
	SimStatus,
} from '@travelpulse/interfaces';
import { dateJs, PRETTY_DATE_FORMAT } from '@travelpulse/utils';

type ListQuery = {
	status?: 'active' | 'inactive' | 'all';
	page?: string | number;
	size?: string | number;
};

export const listEsimsService = async (
	req: SessionRequest,
	query: ListQuery
): Promise<SIMInfoResponse> => {
	const userId = req.user.accountId;
	const pageNum = Math.max(parseInt(String(query.page ?? '1'), 10) || 1, 1);
	const sizeNum = Math.min(
		Math.max(parseInt(String(query.size ?? '20'), 10) || 20, 1),
		100
	);
	const offset = (pageNum - 1) * sizeNum;

	const statusFilter = (() => {
		switch (query.status) {
			case 'active':
				return { status: SimStatus.ACTIVE };
			case 'inactive':
				return { status: { [Op.ne]: SimStatus.ACTIVE } };
			default:
				return {};
		}
	})();

	const { rows, count } = await Sim.findAndCountAll({
		where: {
			...statusFilter,
		},
		include: [
			{
				model: ProviderOrder,
				as: 'providerOrder',
				required: true,
				attributes: [
					'id',
					'packageId',
					'type',
					'dataAmount',
					'data',
					'validity',
					'voice',
					'text',
					'price',
					'currency',
				],
				include: [
					{
						model: Order,
						as: 'order',
						required: true,
						where: { userId },
						attributes: ['id', 'orderNumber'],
					},
				],
			},
		],
		order: [['createdAt', 'DESC']],
		limit: sizeNum,
		offset,
	});

	const items: SIMInfo[] = rows.map((sim) => {
		const po = sim.get('providerOrder') as ProviderOrder;
		const order = po?.get('order') as Order | undefined;
		const expiredAt = sim.expiredAt
			? dateJs(sim.expiredAt).format(PRETTY_DATE_FORMAT)
			: '-';

		return {
			id: sim.id,
			status: sim.status,
			name: po.packageId || 'eSIM Plan',
			msisdn: sim.msisdn,
			remaining: sim.remaining,
			total: sim.total,
			expiredAt,
			apnType: sim.apnType,
			apnValue: sim.apnValue,
			directAppleInstallationUrl: sim.directAppleInstallationUrl,
			providerOrder: po
				? {
						id: po.id,
						packageId: po.packageId,
						type: po.type,
						voice: po.voice,
						text: po.text,
						price: po.price,
						currency: po.currency,
					}
				: null,
			order: order
				? { id: order.id, orderNumber: order.orderNumber }
				: null,
		};
	});

	return {
		items,
		page: pageNum,
		size: sizeNum,
		total: count,
	};
};

export const getEsimDetailsService = async (
	req: SessionRequest
): Promise<SIMDetails> => {
	const userId = req.user.accountId;
	const simId = Number(req.params.simId);

	const sim = await Sim.findOne({
		where: { id: simId },
		include: [
			{
				model: ProviderOrder,
				as: 'providerOrder',
				required: true,
				include: [
					{
						model: Order,
						as: 'order',
						required: true,
						where: { userId },
						attributes: ['id', 'orderNumber', 'userId'],
					},
				],
			},
		],
	});

	if (!sim) {
		throw new NotFoundException('eSIM not found', null);
	}

	const po = sim.get('providerOrder') as ProviderOrder;
	const order = po?.get('order') as Order | undefined;
	const expiredAt = sim.expiredAt
		? dateJs(sim.expiredAt).format(PRETTY_DATE_FORMAT)
		: '-';

	return {
		id: sim.id,
		name: po.packageId || 'eSIM Plan',
		status: sim.status,
		msisdn: sim.msisdn,
		iccid: sim.iccid,
		lpa: sim.lpa,
		activationCode: sim.qrcode,
		qrcodeUrl: sim.qrcodeUrl,
		remaining: sim.remaining,
		total: sim.total,
		expiredAt,
		apnType: sim.apnType,
		apnValue: sim.apnValue,
		isRoaming: sim.isRoaming,
		confirmationCode: sim.confirmationCode,
		apn: sim.apn,
		directAppleInstallationUrl: sim.directAppleInstallationUrl,
		providerOrder: po
			? {
					id: po.id,
					packageId: po.packageId,
					type: po.type,
					voice: po.voice,
					text: po.text,
					price: po.price,
					currency: po.currency,
				}
			: null,
		order: order ? { id: order.id, orderNumber: order.orderNumber } : null,
	};
};

export const getEsimQrService = async (req: SessionRequest) => {
	const userId = req.user.accountId;
	const simId = Number(req.params.simId);

	const sim = await Sim.findOne({
		where: { id: simId },
		include: [
			{
				model: ProviderOrder,
				as: 'providerOrder',
				required: true,
				include: [
					{
						model: Order,
						as: 'order',
						required: true,
						where: { userId },
						attributes: ['id'],
					},
				],
			},
		],
		attributes: ['id', 'qrcode', 'qrcodeUrl'],
	});

	if (!sim) {
		throw new NotFoundException('eSIM not found', null);
	}

	return { id: sim.id, qrcode: sim.qrcode, qrcodeUrl: sim.qrcodeUrl };
};
