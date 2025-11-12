import { Suspense } from 'react';
import { CountryProduct, ResponseData } from '@travelpulse/interfaces';
import { APIRequest } from '@travelpulse/api-service';
import HomePageClient from './home-page-client';

const POPULAR_DESTINATION_SIZE = 6;
const MULTIPLE_REGION_SIZE = 8;

async function fetchPopularDestinations() {
	const response = await APIRequest.get<ResponseData<CountryProduct[]>>(
		'/api/products/popular-destinations',
		{
			params: {
				size: POPULAR_DESTINATION_SIZE,
			},
		}
	);

	const payload = response.data;

	if (!payload.success) {
		throw new Error(
			payload.message ?? 'Failed to load popular destinations.'
		);
	}

	return Array.isArray(payload.data) ? payload.data : [];
}

async function fetchMultipleRegions() {
	const response = await APIRequest.get<ResponseData<CountryProduct[]>>(
		'/api/products/regions',
		{
			params: {
				size: MULTIPLE_REGION_SIZE,
			},
		}
	);

	const payload = response.data;

	if (!payload.success) {
		throw new Error(payload.message ?? 'Failed to load regions.');
	}

	return Array.isArray(payload.data) ? payload.data : [];
}

async function HomePageContent() {
	const [popularDestinations, multipleRegions] = await Promise.all([
		fetchPopularDestinations(),
		fetchMultipleRegions(),
	]);

	return (
		<HomePageClient
			popularDestinations={popularDestinations}
			multipleRegions={multipleRegions}
		/>
	);
}

function HomePageFallback() {
	return (
		<div className="flex w-full justify-center py-24 text-lg font-medium">
			Loading destinations...
		</div>
	);
}

export default function HomePage() {
	return (
		<Suspense fallback={<HomePageFallback />}>
			<HomePageContent />
		</Suspense>
	);
}
