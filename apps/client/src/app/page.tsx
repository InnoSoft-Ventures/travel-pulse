'use client';

import {
	Hero,
	Input,
	Button,
	FeatureCard,
	Title,
	DestinationCards,
	SearchAndCalendar,
} from '@travelpulse/ui';

// Icons
import Characters from '@/assets/characters.svg';
import YellowStar from '@/assets/yellow-star.svg';
import SearchIcon from '@/assets/search.svg';

import styles from './home.module.scss';
import DUMMY_DESTINATIONS from './data';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { useEffect } from 'react';
import {
	getMultipleRegions,
	getPopularDestinations,
} from '@travelpulse/ui/thunks';

export default function HomePage() {
	const { popularDestinations, multipleRegions } = useAppSelector(
		(state) => state.products
	);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(
			getPopularDestinations({
				size: 6,
			})
		);
		dispatch(
			getMultipleRegions({
				size: 6,
			})
		);
	}, [dispatch]);

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
					<SearchAndCalendar
						inputVariant="secondary"
						className={styles.homePackageSearch}
					/>
				</div>

				<div className={styles.popularDestinationContainer}>
					<Title size="size20" className={styles.popularDestination}>
						Popular destinations
					</Title>

					<DestinationCards
						data={popularDestinations.list}
						destinationType="popular"
						isLoading={popularDestinations.status === 'loading'}
					/>

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

						<DestinationCards
							data={multipleRegions.list}
							destinationType="regions"
							isLoading={multipleRegions.status === 'loading'}
						/>

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
