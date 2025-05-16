import React from 'react';
import { PopularDestination } from '../../popular-destination';
import { Region } from '../../region';
import styles from './destination-cards.module.scss';
import africaImage from '../../../assets/africa.jpg';
import { CountryProduct } from '@travelpulse/interfaces';

interface DestinationCardsProps {
	data: CountryProduct[];
	destinationType?: 'popular' | 'regions' | 'local' | 'all';
	isLoading?: boolean;
}

function DestinationCards(props: DestinationCardsProps) {
	const { data, destinationType = 'popular', isLoading } = props;

	return (
		<div className={styles.popularDestinationCards}>
			{!isLoading &&
				data.map((destination, index) => {
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
