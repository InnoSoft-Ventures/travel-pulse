/**
 * Converts a plan type string (e.g., 'data-voice-text') into a human-readable format.
 * @param planType The plan type string.
 * @returns A formatted string like "Data, Voice & Text", "Data & Voice", or "Data Only".
 */
export const getPlanServices = (planType: string): string => {
	if (!planType || typeof planType !== 'string') {
		return 'Unknown Plan';
	}

	const services = planType.toLowerCase().split('-').sort();
	const serviceMap: { [key: string]: string } = {
		data: 'Data',
		voice: 'Voice',
		text: 'Text',
	};

	const availableServices = services
		.map((service) => serviceMap[service])
		.filter(Boolean);

	if (availableServices.length === 0) {
		return 'Unknown Plan';
	}

	if (availableServices.length === 1) {
		return `${availableServices[0]} Only`;
	}

	if (availableServices.length === 2) {
		return availableServices.join(' & ');
	}

	// Handles 3 or more, e.g., "Data, Voice & Text"
	const lastService = availableServices.pop();
	return `${availableServices.join(', ')} & ${lastService}`;
};
