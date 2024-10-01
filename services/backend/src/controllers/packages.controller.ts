import { Airalo, AiraloPackageWithCountryId } from '@libs/providers';
import { Request, Response } from 'express';
import Country from '../db/models/Country';
import Operator from '../db/models/Operator';
import Package from '../db/models/Package';
import Coverage from '../db/models/Coverage';
import Bottleneck from 'bottleneck';
import { ProviderIdentity } from '@libs/interfaces';

export const authenticate = async (_req: Request, res: Response) => {
	try {
		const airalo = Airalo.getInstance();

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

const limitedFetch = limiter.wrap(async (airalo: Airalo, page: number) => {
	return await airalo.getPackages('local', page, 50);
});

const missingCountries = new Map<string, string>();

const getPackageList = async (
	airalo: Airalo,
	countryCodes: Record<string, number>,
	page: number
) => {
	const packages = await limitedFetch(airalo, page);

	console.log(`Fetched page ${page} of packages`, packages.meta);

	// Process the packages
	const packagesWithCountryId: AiraloPackageWithCountryId[] =
		packages.packages
			.filter((pkg) => {
				if (countryCodes[pkg.country_code]) {
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
		const operatorRecords = pkg.operators.map((operator) => ({
			externalId: operator.id,
			countryId: pkg.countryId,
			provider: ProviderIdentity.AIRALO,
			title: operator.title,
			type: operator.type,
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
		}));

		const operators = await Operator.bulkCreate(operatorRecords, {
			// updateOnDuplicate: ['externalId'],
		});

		// Handle Packages and Coverages
		for (const [index, operator] of pkg.operators.entries()) {
			const operatorId = operators[index].id;

			const packageRecords = operator.packages.map((pkg) => ({
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
		await getPackageList(airalo, countryCodes, page + 1);
	} else {
		console.log(' Finished fetching all packages');
	}
};

export const getPackages = async (_req: Request, res: Response) => {
	const airalo = Airalo.getInstance();

	const countries = await Country.findAll({
		attributes: ['id', 'iso2'],
	});

	const countryCodes = countries.reduce<Record<string, number>>(
		(acc, country) => {
			acc[country.iso2] = country.id;

			return acc;
		},
		{}
	);

	await getPackageList(airalo, countryCodes, 1);

	return res
		.status(200)
		.json({ missingCountries: Array.from(missingCountries) });
};
