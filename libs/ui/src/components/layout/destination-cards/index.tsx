'use client';
import React, { useState } from 'react';
import { PopularDestination } from '../../popular-destination';
import { Region } from '../../region';
import styles from './destination-cards.module.scss';
import africaImage from '../../../assets/africa.jpg';
import { CountryProduct, PackageInterface } from '@travelpulse/interfaces';
import { PlanCard } from '../../plan-card';
import { PlanDetailModal } from '../../plan-detail-modal';

interface DestinationCardsProps {
	data: CountryProduct[] | PackageInterface[];
	destinationType?:
		| 'popular'
		| 'regions'
		| 'local'
		| 'search-results'
		| 'all';
	isLoading?: boolean;
}

function DestinationCards(props: DestinationCardsProps) {
	const { data, destinationType = 'popular', isLoading } = props;

	const [selectedPackage, setSelectedPackage] =
		useState<PackageInterface | null>(null);

	return (
		<div className={styles.popularDestinationCards}>
			{!isLoading &&
				destinationType !== 'search-results' &&
				(data as CountryProduct[]).map((destination, index) => {
					switch (destinationType) {
						case 'popular':
						case 'local':
							return (
								<PopularDestination
									key={`popular-destination-${index}`}
									flagUrl={destination.flag}
									price={destination.price}
									countryName={destination.name}
								/>
							);
						case 'regions':
							return (
								<Region
									key={`popular-destination-${index}`}
									imageSrc={africaImage}
									price={destination.price}
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
							details={{
								id: pkg.packageId,
								name: pkg.title,
								price: pkg.price,
								data: pkg.data,
								duration: pkg.day,
							}}
							showPlanDetails={() => setSelectedPackage(pkg)}
						/>
					);
				})}

			<PlanDetailModal
				open={!!selectedPackage}
				onClose={() => setSelectedPackage(null)}
			/>

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
