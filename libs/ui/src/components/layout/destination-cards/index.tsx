'use client';
import React, { useState } from 'react';
import { DestinationCard } from '../../destination-card';
import { Region } from '../../region';
import styles from './destination-cards.module.scss';
import africaImage from '../../../assets/africa.jpg';
import {
	CountryPackageType,
	CountryProduct,
	PackageInterface,
} from '@travelpulse/interfaces';
import { PlanCard } from '../../plan-card';
import { PlanDetailModal } from '../../plan-detail-modal';
import { cn } from '../../../utils';
import { useAppSelector } from '@travelpulse/state';
import { dateJs } from '@travelpulse/utils';

interface DestinationCardsProps {
	data: CountryPackageType;
	destinationType?:
		| 'popular'
		| 'regions'
		| 'region-link'
		| 'local'
		| 'search-results'
		| 'popular-countries'
		| 'all';
	isLoading?: boolean;
}

function DestinationCards(props: DestinationCardsProps) {
	const { data, destinationType = 'popular', isLoading } = props;

	const [selectedPackage, setSelectedPackage] =
		useState<PackageInterface | null>(null);
	const { dates } = useAppSelector((state) => state.metaData);

	return (
		<div
			className={cn(
				styles.popularDestinationCards,
				destinationType === 'search-results' && styles.searchResults
			)}
		>
			{!isLoading &&
				destinationType !== 'search-results' &&
				(data as CountryProduct[]).map((destination, index) => {
					switch (destinationType) {
						case 'popular':
							return (
								<DestinationCard
									key={`popular-destination-${index}`}
									flagUrl={destination.flag}
									price={destination.price}
									countryName={destination.name}
								/>
							);
						case 'local':
						case 'region-link':
							return (
								<DestinationCard
									key={`popular-destination-${index}`}
									flagUrl={destination.flag}
									slugLink={
										destinationType === 'local'
											? `/${destination.slug}-esim`
											: `/${destination.slug}-regional-esim`
									}
									countryName={destination.name}
								/>
							);
						case 'regions':
							return (
								<Region
									key={`popular-destination-${index}`}
									imageSrc={africaImage}
									price={destination.price}
									slug={destination.slug}
									continentName={destination.name}
								/>
							);
						default:
							return '';
					}
				})}

			{!isLoading &&
				destinationType === 'search-results' &&
				(data as PackageInterface[]).map((pkg, index) => {
					return (
						<PlanCard
							key={`search-result-pkg-${pkg.packageId}-${index}`}
							packageDetails={pkg}
							showPlanDetails={() => setSelectedPackage(pkg)}
						/>
					);
				})}

			{selectedPackage && (
				<PlanDetailModal
					open={!!selectedPackage}
					data={selectedPackage}
					startDate={dateJs(dates.start)}
					endDate={dateJs(dates.end)}
					onClose={() => setSelectedPackage(null)}
				/>
			)}

			{isLoading && (
				<div className={styles.loadingContainer}>
					<div className={styles.loadingText}>Loading...</div>
				</div>
			)}

			{!isLoading && data.length === 0 && (
				<div className={styles.noDataContainer}>
					<div className={styles.noDataText}>No data available</div>
				</div>
			)}
		</div>
	);
}

export { DestinationCards };
