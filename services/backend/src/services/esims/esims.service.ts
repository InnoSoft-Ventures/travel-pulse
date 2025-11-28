import { NotFoundException } from '@travelpulse/middlewares';
import { SessionRequest } from '../../../types/express';
import Sim from '../../db/models/Sims';
import ProviderOrder from '../../db/models/ProviderOrder';
import Package from '../../db/models/Package';
import Operator from '../../db/models/Operator';
import Continent from '../../db/models/Continent';
import Country from '../../db/models/Country';
import Order from '../../db/models/Order';
import PackageHistory from '../../db/models/PackageHistory';
import {
	PackageHistoryItem,
	PackageHistoryResponse,
	SIMDetails,
	SIMInfoResponse,
	SimStatus,
} from '@travelpulse/interfaces';
import { dateJs, PRETTY_DATETIME_FORMAT } from '@travelpulse/utils';
import { getActivePackageForSim } from '../package-history.service';

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

	// Build status filter for PackageHistory if needed
	const packageHistoryWhere: any = {};
	if (query.status === 'active') {
		packageHistoryWhere.status = SimStatus.ACTIVE;
	} else if (query.status === 'inactive') {
		packageHistoryWhere.status = {
			[require('sequelize').Op.ne]: SimStatus.ACTIVE,
		};
	}

	const { rows, count } = await Sim.findAndCountAll({
		where: {},
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
			{
				model: PackageHistory,
				as: 'packageHistories',
				required: query.status !== 'all' && query.status !== undefined,
				where: packageHistoryWhere,
				attributes: [
					'id',
					'status',
					'validityDays',
					'remainingData',
					'totalData',
					'expiresAt',
				],
				limit: 1,
				order: [
					['status', 'DESC'], // ACTIVE comes before NOT_ACTIVE
					['createdAt', 'DESC'],
				],
			},
		],
		order: [['createdAt', 'DESC']],
		limit: sizeNum,
		offset,
		distinct: true,
	});

	const items: SIMDetails[] = rows.map((sim) => {
		const po = sim.get('providerOrder') as ProviderOrder | undefined;
		const order = po?.get('order') as Order | undefined;
		const packageHistories = sim.get('packageHistories') as
			| PackageHistory[]
			| undefined;

		// Get the most relevant package (active or latest)
		const activePackage = packageHistories?.[0];

		const expiredAt = activePackage?.expiresAt
			? dateJs(activePackage.expiresAt).format(PRETTY_DATETIME_FORMAT)
			: '-';
		const planName =
			sim.name ?? po?.package ?? po?.packageId ?? 'eSIM Plan';

		const validity = activePackage?.validityDays ?? 0;
		const days = validity > 1 ? `${validity} days` : '0 day';

		return {
			id: sim.id,
			status: activePackage?.status ?? SimStatus.NOT_ACTIVE,
			name: planName,
			msisdn: sim.msisdn,
			iccid: sim.iccid,
			isRoaming: sim.isRoaming,
			confirmationCode: sim.confirmationCode,
			apn: sim.apn,
			lpa: sim.lpa,
			activationCode: '',
			qrcodeUrl: sim.qrcodeUrl,
			remaining: activePackage?.remainingData ?? 0,
			validity: days,
			total: activePackage?.totalData ?? 0,
			apnType: sim.apnType,
			apnValue: sim.apnValue,
			directAppleInstallationUrl: sim.directAppleInstallationUrl,
			order: order
				? { id: order.id, orderNumber: order.orderNumber }
				: null,
			country: null,
			continent: null,
			expiredAt,
			createdAt: dateJs(sim.createdAt).format(PRETTY_DATETIME_FORMAT),
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

	// Get active package for this SIM
	const activePackage = await getActivePackageForSim(sim.id);

	const expiredAt = activePackage?.expiresAt
		? dateJs(activePackage.expiresAt).format(PRETTY_DATETIME_FORMAT)
		: '-';

	const friendlyName =
		sim.name ?? po?.package ?? po?.packageId ?? 'eSIM Plan';
	const validity = activePackage?.validityDays ?? 0;
	const days = validity > 1 ? `${validity} days` : '0 day';

	return {
		id: sim.id,
		name: friendlyName,
		status: activePackage?.status ?? SimStatus.NOT_ACTIVE,
		msisdn: sim.msisdn,
		iccid: sim.iccid,
		lpa: sim.lpa,
		activationCode: sim.qrcode,
		qrcodeUrl: sim.qrcodeUrl,
		remaining: activePackage?.remainingData ?? 0,
		total: activePackage?.totalData ?? 0,
		apnType: sim.apnType,
		apnValue: sim.apnValue,
		isRoaming: sim.isRoaming,
		confirmationCode: sim.confirmationCode,
		apn: sim.apn,
		validity: days,
		directAppleInstallationUrl: sim.directAppleInstallationUrl,
		order: order ? { id: order.id, orderNumber: order.orderNumber } : null,
		country,
		continent,
		expiredAt,
		createdAt: dateJs(sim.createdAt).format(PRETTY_DATETIME_FORMAT),
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

export const getPackageHistoryService = async (
	req: SessionRequest
): Promise<PackageHistoryResponse> => {
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
	});

	const mappedHistory = history.map(
		(record): PackageHistoryItem => ({
			id: record.id,
			actionType: record.actionType,
			status: record.status,
			packageId: record.packageId,
			totalDataMB: record.totalData,
			remainingDataMB: record.remainingData,
			totalVoice: record.totalVoice,
			remainingVoice: record.remainingVoice,
			totalText: record.totalText,
			remainingText: record.remainingText,
			isUnlimited: record.isUnlimited,
			validityDays: record.validityDays,
			activatedAt: record.activatedAt
				? dateJs(record.activatedAt).format(PRETTY_DATETIME_FORMAT)
				: '-',
			expiresAt: record.expiresAt
				? dateJs(record.expiresAt).format(PRETTY_DATETIME_FORMAT)
				: '-',
			createdAt: dateJs(record.createdAt).format(PRETTY_DATETIME_FORMAT),
		})
	);

	return { simId, history: mappedHistory };
};
