import { Metadata } from 'next';

export async function generateMetadata(data: any): Promise<Metadata> {
	return {
		title: 'Local Destinations - TravelPulse eSIM Solutions',
		description:
			'Discover local eSIM plans and stay connected while traveling. Explore our range of local data plans for seamless connectivity in your destination.',
	};
}

export { default } from './destination-client';
