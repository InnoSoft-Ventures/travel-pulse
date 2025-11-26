import { NotFoundException } from '@travelpulse/middlewares';
import { SessionRequest } from '../../../types/express';
import { Op } from 'sequelize';
import Sim from '../../db/models/Sims';
import ProviderOrder from '../../db/models/ProviderOrder';
import Package from '../../db/models/Package';
import Operator from '../../db/models/Operator';
import Continent from '../../db/models/Continent';
import Country from '../../db/models/Country';
import Order from '../../db/models/Order';
import PackageHistory from '../../db/models/PackageHistory';
import {
	SIMDetails,
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

	const items: SIMDetails[] = rows.map((sim) => {
		const po = sim.get('providerOrder') as ProviderOrder | undefined;
		const order = po?.get('order') as Order | undefined;
		const expiredAt = sim.expiredAt
			? dateJs(sim.expiredAt).format(PRETTY_DATE_FORMAT)
			: '-';
		const planName =
			sim.name ?? po?.package ?? po?.packageId ?? 'eSIM Plan';

		const validity = po?.validity ?? 0;
		const days = validity > 1 ? `${validity} days` : '0 day';

		return {
			id: sim.id,
			status: sim.status,
			name: planName,
			msisdn: sim.msisdn,
			iccid: sim.iccid,
			isRoaming: sim.isRoaming,
			confirmationCode: sim.confirmationCode,
			apn: sim.apn,
			lpa: sim.lpa,
			activationCode: '',
			qrcodeUrl: sim.qrcodeUrl,
			remaining: sim.remaining,
			validity: days,
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
			country: null,
			continent: null,
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

	const po = sim.get('providerOrder') as ProviderOrder | undefined;

	// Resolve country by looking up the package via externalPackageId/provider
	let country: {
		id: number;
		name: string;
		iso2: string;
		flag: string;
	} | null = null;
	let continent: { id: number; name: string } | null = null;

	try {
		if (po?.packageId && po?.provider) {
			const pkg = await Package.findOne({
				where: {
					externalPackageId: po.packageId,
					provider: po.provider as any,
				},
				attributes: ['id', 'operatorId'],
				include: [
					{
						model: Operator,
						as: 'operator',
						attributes: ['id', 'countryId', 'continentId'],
						include: [
							{
								model: Country,
								as: 'country',
								attributes: ['id', 'name', 'iso2', 'flag'],
								required: false,
							},
							{
								model: Continent,
								as: 'continent',
								attributes: ['id', 'name'],
								required: false,
							},
						],
					},
				],
			});

			const op = pkg?.get('operator') as Operator | undefined;
			const c = op?.get('country') as Country | undefined;
			const cont = op?.get('continent') as Continent | undefined;
			if (c) {
				country = {
					id: (c as any).id,
					name: (c as any).name,
					iso2: (c as any).iso2,
					flag: (c as any).flag,
				};
			}
			if (cont) {
				continent = { id: (cont as any).id, name: (cont as any).name };
			}
		}
	} catch (error) {
		console.error('Error fetching country for eSIM details:', error);
		country = null;
		continent = null;
	}

	const order = po?.get('order') as Order | undefined;
	const expiredAt = sim.expiredAt
		? dateJs(sim.expiredAt).format(PRETTY_DATE_FORMAT)
		: '-';

	const friendlyName =
		sim.name ?? po?.package ?? po?.packageId ?? 'eSIM Plan';
	const validity = po?.validity ?? 0;
	const days = validity > 1 ? `${validity} days` : '0 day';

	return {
		id: sim.id,
		name: friendlyName,
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
		validity: days,
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
		country,
		continent,
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

export const getPackageHistoryService = async (req: SessionRequest) => {
	const userId = req.user.accountId;
	const simId = Number(req.params.simId);

	// First verify the SIM belongs to the user
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
		attributes: ['id'],
	});

	if (!sim) {
		throw new NotFoundException('eSIM not found', null);
	}

	// Fetch package history for this SIM
	const history = await PackageHistory.findAll({
		where: { simId },
		order: [['createdAt', 'DESC']],
		include: [
			{
				model: ProviderOrder,
				as: 'providerOrder',
				attributes: ['id', 'externalOrderId'],
				required: false,
			},
		],
	});

	return history.map((record) => ({
		id: record.id,
		actionType: record.actionType,
		status: record.status,
		packageId: record.packageId,
		packageName: record.packageName,
		dataAmount: record.dataAmount,
		voiceAmount: record.voiceAmount,
		textAmount: record.textAmount,
		validityDays: record.validityDays,
		price: Number(record.price),
		netPrice: record.netPrice ? Number(record.netPrice) : null,
		currency: record.currency,
		activatedAt: record.activatedAt
			? dateJs(record.activatedAt).format(PRETTY_DATE_FORMAT)
			: null,
		expiresAt: record.expiresAt
			? dateJs(record.expiresAt).format(PRETTY_DATE_FORMAT)
			: null,
		createdAt: dateJs(record.createdAt).format(PRETTY_DATE_FORMAT),
		providerOrder: record.providerOrderId
			? {
					id: record.providerOrderId,
					externalOrderId:
						(record.get('providerOrder') as any)
							?.externalOrderId ?? null,
				}
			: null,
	}));
};
