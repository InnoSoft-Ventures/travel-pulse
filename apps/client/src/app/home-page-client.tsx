'use client';
import styles from './home.module.scss';
import { CountryProduct } from '@travelpulse/interfaces';
import { DestinationCards, Title } from '@travelpulse/ui';
import { useAppSelector } from '@travelpulse/ui/state';

export function PopularDestinationsClient({
	initialData,
}: {
	initialData: CountryProduct[];
}) {
	const { productSearch } = useAppSelector((state) => state.app.products);

	const searchPackages = productSearch?.data?.packages ?? [];
	const hasSearchPackages = searchPackages.length > 0;

	const title = hasSearchPackages
		? 'Our best selling eSIMs'
		: 'Popular destinations';
	const destinationType = hasSearchPackages ? 'search-results' : 'popular';
	const data = hasSearchPackages ? searchPackages : initialData;
	const isLoading = productSearch.status === 'loading';

	return (
		<>
			<Title size="size20" className={styles.popularDestination}>
				{title}
			</Title>

			<DestinationCards
				data={data}
				destinationType={destinationType}
				isLoading={isLoading}
			/>
		</>
	);
}
