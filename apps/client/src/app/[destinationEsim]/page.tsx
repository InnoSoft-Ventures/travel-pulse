import type { Metadata, ResolvingMetadata } from 'next';
import DestinationEsimContent from './DestinationEsimContent';
import { notFound } from 'next/navigation';
import 'server-only';
import {
	Continent,
	ResponseData,
	UIPlanType,
	type Country,
} from '@travelpulse/interfaces';
import { APIRequest } from '@travelpulse/api-service';

async function fetchData(info: {
	target: UIPlanType;
	slug: string;
}): Promise<Country | Continent | null> {
	switch (info.target) {
		case UIPlanType.Local: {
			const res = await APIRequest.get<ResponseData<Country[]>>(
				`/api/data/countries/search?query=${info.slug}&matchType=exact`
			);

			const payload = res.data;

			if (!payload.success) return null;

			const { data } = payload;

			return data[0] || null;
		}
		default: {
			const res = await APIRequest.get<ResponseData<Continent>>(
				`/api/data/regions/${info.slug}`
			);

			const payload = res.data;

			if (!payload.success) return null;

			const { data } = payload;
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

	if (!destination) notFound();

	return (
		<DestinationEsimContent
			targetDestination={results.target}
			destination={destination}
		/>
	);
}
