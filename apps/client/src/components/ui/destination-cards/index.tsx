import { PopularDestination } from '../popular-destination';
import { Region } from '../region';
import styles from './destination-cards.module.scss';
import africaImage from '@/assets/africa.jpg';

interface DestinationCardsProps {
	data: {
		flag: string;
		countryName: string;
		price: string;
	}[];
	destinationType?: 'popular' | 'regions' | 'local' | 'all';
}

function DestinationCards(props: DestinationCardsProps) {
	const { data, destinationType = 'popular' } = props;

	return (
		<div className={styles.popularDestinationCards}>
			{data.map((destination, index) => {
				switch (destinationType) {
					case 'popular':
					case 'local':
						return (
							<PopularDestination
								key={`popular-destination-${index}`}
								flagUrl={destination.flag}
								price={destination.price}
								countryName={destination.countryName}
							/>
						);
					case 'regions':
						return (
							<Region
								key={`popular-destination-${index}`}
								imageSrc={africaImage}
								price={destination.price}
								continentName={destination.countryName}
							/>
						);
				}
			})}
		</div>
	);
}

export { DestinationCards };
