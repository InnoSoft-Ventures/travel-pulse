import { Title, DestinationCards } from '@travelpulse/ui';
import styles from './home.module.scss';
import { CountryProduct, ResponseData } from '@travelpulse/interfaces';
import { RequestService } from '@travelpulse/api-service';
import { PopularDestinationsClient } from './home-page-client';

const POPULAR_DESTINATION_SIZE = 6;
const MULTIPLE_REGION_SIZE = 8;

async function fetchPopularDestinations() {
	const response = await RequestService().get<ResponseData<CountryProduct[]>>(
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
	const response = await RequestService().get<ResponseData<CountryProduct[]>>(
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

// Server Component: Fetches and renders popular destinations
export async function PopularDestinationsSection() {
	const data = await fetchPopularDestinations();

	return <PopularDestinationsClient initialData={data} />;
}

// Server Component: Fetches and renders multiple regions
export async function MultipleRegionsSection() {
	const data = await fetchMultipleRegions();

	return (
		<>
			<Title size="size20" className={styles.popularDestination}>
				Exploring Multiple Regions
			</Title>

			<DestinationCards
				data={data}
				destinationType="regions"
				isLoading={false}
			/>
		</>
	);
}
