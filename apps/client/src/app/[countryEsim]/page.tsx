import type { Metadata, ResolvingMetadata } from 'next';
import CountryContent from './CountryContent';
import { notFound } from 'next/navigation';
import 'server-only';
import type { Country, SuccessResponse } from '@travelpulse/interfaces';

async function fetchCountry(slug: string): Promise<Country | null> {
	const res = await fetch(
		`http://localhost:4000/data/countries/search?query=${slug}&matchType=exact`
	);

	if (!res.ok) return null;
	const { data }: SuccessResponse<Country[]> = await res.json();

	return data[0] || null;
}

export async function generateMetadata(
	{ params }: { params: { countryEsim: string } },
	parent: ResolvingMetadata
): Promise<Metadata> {
	const slug = params.countryEsim.replace(/-esim$/, '');
	const country = await fetchCountry(slug);

	if (!country) return { title: 'Not Found' };

	return {
		title: `${country.name} eSIM`,
		description: `Affordable eSIM plans for ${country.name}.`,
	};
}

export default async function CountryPage({
	params,
}: {
	params: { countryEsim: string };
}) {
	const slug = params.countryEsim.replace(/-esim$/, '');
	const country = await fetchCountry(slug);

	if (!country) notFound();

	console.log('Country data fetched:', country);

	return <CountryContent country={country} />;
}
