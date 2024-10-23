import { Hero } from '@/components/ui/hero';

// Icons
import Characters from '@/assets/characters.svg';
import YellowStar from '@/assets/yellow-star.svg';
import SearchIcon from '@/assets/search.svg';
import WhiteSearchIcon from '@/assets/white-search.svg';
import InfoIcon from '@/assets/info.svg';
import LocationIcon from '@/assets/location.svg';
import CalendarIcon from '@/assets/calendar.svg';

import styles from './home.module.scss';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import PopularDestination from '@/components/ui/popular-destination';

const destinations = [
	{
		flag: 'https://flagcdn.com/tf.svg',
		countryName: 'South Africa',
		price: '$2.4',
	},
	{
		flag: 'https://flagcdn.com/tf.svg',
		countryName: 'South Africa',
		price: '$2.4',
	},
	{
		flag: 'https://flagcdn.com/tf.svg',
		countryName: 'South Africa',
		price: '$2.4',
	},
	{
		flag: 'https://flagcdn.com/tf.svg',
		countryName: 'South Africa',
		price: '$2.4',
	},
	{
		flag: 'https://flagcdn.com/tf.svg',
		countryName: 'South Africa',
		price: '$2.4',
	},
	{
		flag: 'https://flagcdn.com/za.svg',
		countryName: 'Germany',
		price: '$2.4',
	},
];

export default function Home() {
	return (
		<>
			<Hero>
				<div className={styles.homeContainer}>
					<div className={styles.contentContainer}>
						<div className={styles.homeContentContainer}>
							<div className={styles.headerText}>
								<div className={styles.yellowStar}>
									<YellowStar />
								</div>
								<h1 className={styles.title}>
									Stay connected wherever you travel, with
									affordable rates.
								</h1>
								<h2 className={styles.subTitle}>
									Explore the world without losing connection.
									Choose from hundreds of data plans and enjoy
									fast, seamless eSIM connectivity tailored
									for travelers and digital nomads.
								</h2>
								<div className={styles.searchContainer}>
									<Input
										icon={<SearchIcon />}
										type="search"
										id="header-search"
										name="destination-search"
										placeholder="Search your destination for 200+ countries and regions"
									/>
								</div>
							</div>
							<div>
								<Characters />
							</div>
						</div>
					</div>
				</div>
			</Hero>
			<main className={styles.homeMain}>
				<div className={styles.mainTitle}>
					What’s your next <span>destination?</span>
				</div>
				<div className={styles.mainSubTitle}>
					Pick a prepaid eSIM data plan for your upcoming trip
				</div>

				<div className={styles.homePackageSearch}>
					<Input
						icon={<LocationIcon />}
						size="large"
						variant="secondary"
						placeholder="Where do you need internet?"
					/>
					<Input
						icon={<CalendarIcon />}
						lastIcon={
							<button className={styles.infoIconBtn}>
								<InfoIcon />
							</button>
						}
						size="large"
						variant="secondary"
						placeholder="Arrival & Departure"
					/>
					<Button size="lg">
						<WhiteSearchIcon />
						Search
					</Button>
				</div>

				<div>
					<div className={styles.popularDestination}>
						Popular destinations
					</div>
					<div className={styles.popularDestinationCards}>
						{destinations.map((destination, index) => (
							<PopularDestination
								key={`popular-destination-${index}`}
								flagUrl={destination.flag}
								price={destination.price}
								countryName={destination.countryName}
							/>
						))}
					</div>
					<div>
						<Button variant="outline">
							See all 200+ countries
						</Button>
					</div>
				</div>
			</main>
		</>
	);
}
