import {
	Airalo,
	AiraloAuthenticated,
	AiraloPackageWithCountryId,
} from '@travelpulse/providers';
import { Request, Response } from 'express';
import Country from '../db/models/Country';
import Operator from '../db/models/Operator';
import Package, { PackageCreationAttributes } from '../db/models/Package';
import Coverage from '../db/models/Coverage';
import Bottleneck from 'bottleneck';
import { ProviderIdentity } from '@travelpulse/interfaces';
import { errorResponse } from '@travelpulse/middlewares';
import Continent from '../db/models/Continent';

export const authenticate = async (_req: Request, res: Response) => {
	try {
		const airalo = AiraloAuthenticated.getInstance();

		res.status(200).json({
			message: 'Authenticated successfully',
			data: await airalo.authenticate(),
		});
	} catch (error) {
		console.error('Failed to authenticate with Airalo API:', error);

		res.status(500).json({
			message: 'Failed to authenticate with Airalo API',
		});
	}
};

// Create a limit instance for controlling concurrency (40 requests per minute limit)
const limiter = new Bottleneck({
	maxConcurrent: 1, // Ensures one request at a time
	minTime: 1500, // 1500 ms = 1.5 seconds between requests (to not exceed 40 per minute)
});

const limitedFetch = limiter.wrap(
	async (packageType: 'local' | 'global', airalo: Airalo, page: number) => {
		return await airalo.getPackages(packageType, page, 50);
	}
);

const missingCountries = new Map<string, string>();

const getPackageList = async (
	packageType: 'local' | 'global',
	airalo: Airalo,
	data: {
		countryCodes: Record<string, number>;
		continentCodes: Record<string, number>;
	},
	page: number
) => {
	const packages = await limitedFetch(packageType, airalo, page);

	console.log(
		`Fetched page ${page} of packages (${packageType})`,
		packages.meta
	);

	const { countryCodes, continentCodes } = data;

	// Process the packages
	const packagesWithCountryId: AiraloPackageWithCountryId[] =
		packages.packages
			.filter((pkg) => {
				if (countryCodes[pkg.country_code] || !pkg.country_code) {
					return true;
				}
				missingCountries.set(pkg.country_code, pkg.title);
				return false;
			})
			.map((pkg) => ({
				...pkg,
				countryId: countryCodes[pkg.country_code],
			}));

	// Process Operators and Packages
	for (const pkg of packagesWithCountryId) {
		console.log(
			'Processing package',
			pkg.title,
			continentCodes[JSON.stringify([pkg.slug])],
			JSON.stringify([pkg.slug]),
			'\n'
		);
		const operatorRecords = pkg.operators.map((operator) => {
			const type =
				operator.type === 'global'
					? pkg.slug === 'world'
						? 'global'
						: 'regional'
					: 'local';
			let continentId = null;
			const continentInfo = continentCodes[JSON.stringify([pkg.slug])];
			if (type !== 'local' && continentInfo) {
				continentId = continentInfo;
			}

			return {
				externalId: operator.id,
				countryId: pkg.countryId,
				continentId,
				provider: ProviderIdentity.AIRALO,
				title: operator.title,
				type,
				isPrepaid: operator.is_prepaid,
				esimType: operator.esim_type,
				warning: operator.warning,
				apnType: operator.apn_type,
				apnValue: operator.apn_value,
				apn: operator.apn,
				info: operator.info,
				isRoaming: operator.is_roaming,
				planType: operator.plan_type,
				activationPolicy: operator.activation_policy,
				isKycVerify: operator.is_kyc_verify,
				rechargeability: operator.rechargeability,
				otherInfo: operator.other_info,
			};
		});

		const operators = await Operator.bulkCreate(operatorRecords, {
			// updateOnDuplicate: ['externalId'],
		});

		// Handle Packages and Coverages
		for (const [index, operator] of pkg.operators.entries()) {
			const operatorId = operators[index].id;

			const packageRecords: PackageCreationAttributes[] =
				operator.packages.map((pkg) => ({
					operatorId,
					externalPackageId: pkg.id,
					provider: ProviderIdentity.AIRALO,
					type: pkg.type,
					title: pkg.title,
					price: pkg.price,
					amount: pkg.amount,
					day: pkg.day,
					isUnlimited: pkg.is_unlimited,
					data: pkg.data,
					shortInfo: pkg.short_info,
					qrInstallation: pkg.qr_installation,
					manualInstallation: pkg.manual_installation,
					voice: pkg.voice,
					text: pkg.text,
					netPrice: pkg.net_price,
				}));

			const coverageRecord = {
				operatorId,
				data: operator.coverages,
			};

			await Promise.all([
				Package.bulkCreate(packageRecords, {
					updateOnDuplicate: [
						'externalPackageId',
						'title',
						'price',
						'amount',
						'day',
					],
				}),
				Coverage.upsert(coverageRecord),
			]);
		}
	}

	if (packages.meta.next) {
		await getPackageList(packageType, airalo, data, page + 1);
	} else {
		console.log(' Finished fetching all packages');
	}
};

async function getData() {
	const [countries, continents] = await Promise.all([
		Country.findAll({
			attributes: ['id', 'iso2'],
		}),
		Continent.findAll(),
	]);

	const countryCodes = countries.reduce<Record<string, number>>(
		(acc, country) => {
			acc[country.iso2] = country.id;

			return acc;
		},
		{}
	);

	const continentCodes = continents.reduce<Record<string, number>>(
		(acc, continent) => {
			acc[continent.aliasList.toString()] = continent.id;

			return acc;
		},
		{}
	);

	return { countryCodes, continentCodes };
}

export const getPackages = async (req: Request, res: Response) => {
	const { type } = req.query;

	if (!['local', 'global'].includes(type as string)) {
		return res
			.status(400)
			.json(
				errorResponse(
					'Invalid package type, supported types are "local" and "global"'
				)
			);
	}

	const airalo = Airalo.getInstance();

	const dataInfo = await getData();

	await getPackageList(type as 'local' | 'global', airalo, dataInfo, 1);

	return res
		.status(200)
		.json({ missingCountries: Array.from(missingCountries) });
};
