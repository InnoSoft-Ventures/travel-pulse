import {
	Hero,
	PopularDestination,
	Input,
	Button,
	Region,
	FeatureCard,
	Title,
} from '@/components/ui';

// Icons
import Characters from '@/assets/characters.svg';
import YellowStar from '@/assets/yellow-star.svg';
import SearchIcon from '@/assets/search.svg';
import WhiteSearchIcon from '@/assets/white-search.svg';
import InfoIcon from '@/assets/info.svg';
import LocationIcon from '@/assets/location.svg';
import CalendarIcon from '@/assets/calendar.svg';

import africaImage from '@/assets/africa.jpg';

import styles from './home.module.scss';

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

export default function HomePage() {
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
								<Title
									className={styles.title}
									color="secondary"
									size="size35"
								>
									Stay connected wherever you travel, with
									affordable rates.
								</Title>
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
				<Title
					dualColor="primary"
					size="size45"
					className={styles.mainTitle}
					position="center"
				>
					What’s your next <span>destination?</span>
				</Title>
				<Title
					size="size16"
					position="center"
					className={styles.mainSubTitle}
				>
					Pick a prepaid eSIM data plan for your upcoming trip
				</Title>

				<div className={styles.homePackageContainer}>
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
				</div>

				<div className={styles.popularDestinationContainer}>
					<Title size="size20" className={styles.popularDestination}>
						Popular destinations
					</Title>
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
					<div className="text-center">
						<Button variant="outline" className={styles.seeAllBtn}>
							See all 200+ countries
						</Button>
					</div>
				</div>
				<div className={styles.multipleRegionsContainer}>
					<div className={styles.stayConnected}></div>
					<Title dualColor="primary" size="size40" position="center">
						<span>Stay Connected</span> Across All Your Travel
						Adventures
					</Title>
					<Title
						size="size16"
						position="center"
						className={styles.mainSubTitle}
					>
						Which top destinations will you be going to?
					</Title>
					<div className={styles.popularDestinationContainer}>
						<Title
							size="size20"
							className={styles.popularDestination}
						>
							Exploring Multiple Regions
						</Title>
						<div className={styles.popularDestinationCards}>
							{destinations.map((destination, index) => (
								<Region
									key={`popular-destination-${index}`}
									imageSrc={africaImage}
									price={destination.price}
									continentName={destination.countryName}
								/>
							))}
						</div>
						<div className="text-center">
							<Button
								variant="outline"
								className={styles.seeAllBtn}
							>
								View all regions
							</Button>
						</div>
					</div>
				</div>

				<div className={styles.choosingContainer}>
					<Title position="center" className={styles.title}>
						Why choose TravelPulse?
					</Title>
					<div className={styles.featureListContainer}>
						<div>
							<FeatureCard />
							<FeatureCard />
							<FeatureCard />
							<FeatureCard />
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
