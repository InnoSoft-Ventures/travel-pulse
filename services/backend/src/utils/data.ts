import {
	CountryPackageInterface,
	OperatorCoverage,
	PackageInterface,
} from '@travelpulse/interfaces';
import Continent from '../db/models/Continent';
import Operator from '../db/models/Operator';
import { getPlanServices } from '@travelpulse/utils';

/**
 * Builds a map from continent alias (string) to continent ID (number).
 *
 * Given a map where each key is a continent ID and each value is an array of aliases
 * for that continent, this function creates a new map where each alias points to its
 * corresponding continent ID. This is useful for quickly looking up a continent ID
 * based on any of its known aliases.
 *
 * @param continentCodes - A Map where the key is the continent ID and the value is an array of aliases for that continent.
 * @returns A Map where the key is an alias (string) and the value is the corresponding continent ID (number).
 */
export function buildAliasToContinentIdMap(
	continents: Continent[]
): Map<string, number> {
	const aliasToId = new Map<string, number>();

	for (const continent of continents) {
		for (const alias of continent.aliasList) {
			aliasToId.set(alias, continent.id);
		}
	}

	return aliasToId;
}

/**
 * Utility to extract speed from info array
 */
export function extractSpeed(info: any): string {
	if (!Array.isArray(info)) return '3G';

	const speedRegex =
		/speed|\d+G|LTE|\d+ ?Mbps|throttle|reduced|limited|maximum|max speed|high speed|unlimited speed/i;
	const comboRegex = /((?:5G|4G|3G|LTE)(?:\s*\/\s*(?:5G|4G|3G|LTE))+)/i;
	const singleRegex = /(5G|4G|3G|LTE|\d+ ?Mbps)/i;
	const fallbackRegex =
		/(\d+G|LTE|\d+ ?Mbps|throttle[\w ]*|reduced speed|limited speed|max(?:imum)? speed|high speed|unlimited speed)/i;

	const speedLine = info.find((line: string) => speedRegex.test(line));

	if (speedLine) {
		const comboMatch = speedLine.match(comboRegex);
		if (comboMatch) return comboMatch[0].replace(/\s+/g, '');
		const singleMatch = speedLine.match(singleRegex);
		if (singleMatch) return singleMatch[0];
		const fallbackMatch = speedLine.match(fallbackRegex);
		return fallbackMatch ? fallbackMatch[0] : speedLine;
	}

	return '3G';
}

/**
 * Utility to extract hotspot sharing info
 */
export function extractHotspot(info: any, otherInfo: any): string {
	const hotspotRegex =
		/hotspot|tether|share data|wifi sharing|wi[- ]?fi sharing/i;
	if (
		(typeof otherInfo === 'string' && hotspotRegex.test(otherInfo)) ||
		(Array.isArray(info) &&
			info.some((line: string) => hotspotRegex.test(line)))
	) {
		return 'Hotspotting is supported — share your connection across devices.';
	}
	return 'Hotspotting is disabled — enjoy connection on a single device.';
}

/**
 * Returns a user-friendly activation policy label based on the given type.
 *
 * @param type - The activation type retrieved from the database.
 * Possible values: 'first-usage', 'immediate', 'manual', 'delayed', 'scheduled', or null.
 *
 * @returns A readable phrase describing the activation policy.
 *
 * @example
 * getActivationPolicyLabel('first-usage'); // "Activates on first use."
 * getActivationPolicyLabel(null);         // "Activation policy not specified."
 */
export function getActivationPolicyLabel(type: string | null): string {
	switch (type) {
		case 'first-usage':
			return 'Activates when the eSIM connects to a mobile network in its coverage area. If you install the eSIM outside of the coverage area, you can connect to a network when you arrive.';
		case 'immediate':
			return 'Activates immediately after purchase.';
		case 'manual':
			return 'Requires manual activation.';
		case 'delayed':
			return 'Activates within 24-48 hours.';
		case 'scheduled':
			return 'Activates on a scheduled date.';
		case null:
		case 'n/a':
		default:
			return 'Activation policy not specified.';
	}
}

function extractNetworks(data: OperatorCoverage[]) {
	return data.flatMap((coverage) => {
		return coverage.networks;
	});
}

export function constructPackageDetails(
	operator: Operator,
	countries: CountryPackageInterface[]
): PackageInterface[] {
	if (!operator.packages) {
		return [];
	}

	// Always ensure info is an array and otherInfo is a string or null
	const info = Array.isArray(operator.info)
		? operator.info
		: typeof operator.info === 'string'
			? [operator.info]
			: [];
	const extraInfo =
		typeof operator.otherInfo === 'string' ? operator.otherInfo : null;

	const speed = extractSpeed(info);
	const hotspotSharing = extractHotspot(info, extraInfo);
	const networks = extractNetworks(operator.coverage?.data || []);

	const data = operator.packages.map((pkg: any) => {
		const details: PackageInterface = {
			packageId: pkg.id,
			title: pkg.title,
			price: pkg.price,
			amount: pkg.amount,
			day: pkg.day,
			data: pkg.data,
			planType: getPlanServices(operator.planType),
			isUnlimited: pkg.isUnlimited,
			countries,
			operator: {
				id: operator.id,
				title: operator.title,
				type: operator.type,
				esimType: operator.esimType,
				extraInfo,
			},
			networks,
			activationPolicy: getActivationPolicyLabel(
				operator.activationPolicy || null
			),
			topupOption:
				typeof operator.rechargeability === 'boolean'
					? operator.rechargeability
						? 'Available'
						: 'Not Available'
					: 'Not Specified',
			eKYC:
				typeof operator.isKycVerify === 'boolean'
					? operator.isKycVerify
						? 'Required'
						: 'Not Required'
					: 'Not Specified',
			speed,
			hotspotSharing,
			coverage: operator.coverage?.data || [],
		};

		return details;
	});

	return data;
}
