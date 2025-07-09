export type DestinationType = 'local' | 'regional' | 'global';

export const destinationCopy: Record<
	DestinationType,
	{
		title: string;
		subtitle: string;
		sectionTitle: string;
		buttonText?: string;
	}
> = {
	local: {
		title: 'Explore Local eSIM Plans',
		subtitle:
			'Connect with country-specific packages tailored to your destination.',
		sectionTitle: 'Local Plans',
		buttonText: 'View all countries',
	},
	regional: {
		title: 'Discover Regional eSIM Bundles',
		subtitle:
			'Stay online across neighboring countries with one regional plan.',
		sectionTitle: 'Regional Plans',
	},
	global: {
		title: 'Go Global with One eSIM',
		subtitle: 'Travel the world with a single eSIM for multiple countries.',
		sectionTitle: 'Global Plans',
	},
};
