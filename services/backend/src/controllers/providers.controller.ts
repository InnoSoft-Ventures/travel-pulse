import {
	Airalo,
	ProviderAuthenticate,
	AiraloPackageWithCountryId,
	AIRALO_API_URL,
	ProviderAccessToken,
} from '@travelpulse/providers';
import { Request, Response } from 'express';
import Country from '../db/models/Country';
import Operator from '../db/models/Operator';
import Package, { PackageCreationAttributes } from '../db/models/Package';
import Coverage from '../db/models/Coverage';
import Bottleneck from 'bottleneck';
import { ProviderIdentity } from '@travelpulse/interfaces';
import {
	errorResponse,
	InternalException,
	successResponse,
} from '@travelpulse/middlewares';
import Continent from '../db/models/Continent';
import Provider from '../db/models/Provider';
import { findProvider } from '../services/provider.service';
import { providerTokenHandler } from '../services/provider-token.service';
import { buildAliasToContinentIdMap } from '../utils/data';

export const airaloAuthenticate = async (_req: Request, res: Response) => {
	try {
		const airalo = ProviderAuthenticate.getInstance();

		const apiURL = `${AIRALO_API_URL}/token`;

		const providerDetails = await findProvider(ProviderIdentity.AIRALO);

		const data = await airalo.authenticate<ProviderAccessToken>(
			ProviderIdentity.AIRALO,
			apiURL,
			{
				clientId: providerDetails.clientId,
				clientSecret: providerDetails.clientSecret,
				grantType: providerDetails.grantType,
			}
		);

		if (!data) {
			throw new InternalException(
				'Failed to authenticate with Airalo API',
				{}
			);
		}

		const { data: airaloSessionData } = data;

		// Save the authentication token to the database
		const [, updated] = await Provider.upsert({
			name: ProviderIdentity.AIRALO,
			identityName:
				ProviderIdentity.AIRALO.toLowerCase() as ProviderIdentity,
			accessToken: airaloSessionData.access_token,
			expiresIn: airaloSessionData.expires_in,
			tokenType: airaloSessionData.token_type,
			issuedAt: new Date(),
		});

		res.status(201).json(
			successResponse({
				message: `Authenticated successfully ${updated ? 'updated' : 'saved'}`,
			})
		);
	} catch (error) {
		console.error('Failed to authenticate with Airalo API:', error);

		res.status(500).json(
			errorResponse('Failed to authenticate with Airalo API')
		);
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

const getAiraloPackageList = async (
	packageType: 'local' | 'global',
	airalo: Airalo,
	data: {
		countryCodes: Record<string, number>;
		continentCodes: Map<string, number>;
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
		let continentId = continentCodes.get(pkg.slug) || null;

		console.log('Processing package', pkg.title, pkg.slug, '\n');

		const operatorRecords = pkg.operators.map((operator) => {
			const type =
				operator.type === 'global'
					? pkg.slug === 'world'
						? 'global'
						: 'regional'
					: 'local';

			if (type === 'local') {
				continentId = null;
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
		await getAiraloPackageList(packageType, airalo, data, page + 1);
	} else {
		console.log(' Finished fetching all packages');
	}
};

async function getData() {
	const [countries, continents] = await Promise.all([
		Country.findAll({
			attributes: ['id', 'iso2'],
			order: [['id', 'ASC']],
		}),
		Continent.findAll({
			attributes: ['id', 'aliasList'],
			order: [['id', 'ASC']],
		}),
	]);

	const countryCodes = countries.reduce<Record<string, number>>(
		(acc, country) => {
			acc[country.iso2] = country.id;

			return acc;
		},
		{}
	);

	const continentCodes = buildAliasToContinentIdMap(continents);

	return { countryCodes, continentCodes };
}

export const getAiraloPackages = async (req: Request, res: Response) => {
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

	// Get Airalo accessToken from DB
	const token = await providerTokenHandler(ProviderIdentity.AIRALO);

	const airalo = Airalo.getInstance(token);

	const dataInfo = await getData();

	await getAiraloPackageList(type as 'local' | 'global', airalo, dataInfo, 1);

	return res
		.status(200)
		.json({ missingCountries: Array.from(missingCountries) });
};
