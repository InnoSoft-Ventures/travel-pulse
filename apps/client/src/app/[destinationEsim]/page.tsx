import type { Metadata, ResolvingMetadata } from 'next';
import DestinationEsimContent from './DestinationEsimContent';
import { notFound } from 'next/navigation';
import 'server-only';
import {
	Continent,
	UIPlanType,
	type Country,
	type SuccessResponse,
} from '@travelpulse/interfaces';

async function fetchData(info: {
	target: UIPlanType;
	slug: string;
}): Promise<Country | Continent | null> {
	switch (info.target) {
		case UIPlanType.Local: {
			const res = await fetch(
				`http://localhost:4000/data/countries/search?query=${info.slug}&matchType=exact`
			);

			if (!res.ok) return null;
			const { data }: SuccessResponse<Country[]> = await res.json();

			return data[0] || null;
		}
		default: {
			const res = await fetch(
				`http://localhost:4000/data/regions/${info.slug}`
			);

			if (!res.ok) return null;
			const { data }: SuccessResponse<Continent> = await res.json();
			console.log('Data fetched:', data);

			return data || null;
		}
	}
}

function determineDestination(destinationEsim: string) {
	const data = destinationEsim.toLowerCase();

	if (data === 'global-esim') {
		return {
			target: UIPlanType.Global,
			slug: data.replace(/-esim$/, ''),
		};
	}

	if (data.includes('-regional-esim')) {
		return {
			target: UIPlanType.Regional,
			slug: data.replace(/-regional-esim$/, ''),
		};
	}

	if (data.includes('-esim')) {
		return {
			target: UIPlanType.Local,
			slug: data.replace(/-esim$/, ''),
		};
	}

	return null;
}

export async function generateMetadata(
	{ params }: { params: { destinationEsim: string } },
	parent: ResolvingMetadata
): Promise<Metadata> {
	const results = determineDestination(params.destinationEsim);

	if (!results) return { title: 'Not Found' };

	const destination = await fetchData(results);

	if (!destination) return { title: 'Not Found' };

	return {
		title: `${destination.name} eSIM`,
		description: `Affordable eSIM plans for ${destination.name}.`,
	};
}

export default async function DestinationEsimPage({
	params,
}: {
	params: { destinationEsim: string };
}) {
	const results = determineDestination(params.destinationEsim);

	if (!results) notFound();

	const destination = await fetchData(results);

	console.log('Reds', destination, results);

	if (!destination) notFound();

	return (
		<DestinationEsimContent
			targetDestination={results.target}
			destination={destination}
		/>
	);
}
