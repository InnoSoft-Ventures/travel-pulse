'use client';

import {
	Hero,
	Button,
	Title,
	DestinationCards,
	Curve,
	SearchAndCalendar,
	SectionCard,
} from '@travelpulse/ui';

// Icons
import Characters from '@/assets/characters.svg';
import YellowStar from '@/assets/yellow-star.svg';
import NetworkIcon from '@/assets/network.svg';
import GlobeIcon from '@/assets/globe.svg';
import FeatherIcon from '@/assets/feather.svg';
import MapIcon from '@/assets/map.svg';
import QRcodeIcon from '@/assets/qr-code.svg';
import SettingsIcon from '@/assets/settings-gear.svg';

import styles from './home.module.scss';
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
				size: 8,
			})
		);
	}, [dispatch]);

	const scrollToDestination = () => {
		const element = document.getElementById('destination-section');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

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
									<Button
										variant="secondary"
										className={styles.searchBtn}
										onClick={scrollToDestination}
									>
										Explore eSIMs for 200+ Countries
									</Button>
								</div>
							</div>
							<div>
								<Characters />
							</div>
						</div>
					</div>
				</div>
			</Hero>

			<div id="destination-section">
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
						<Title
							size="size20"
							className={styles.popularDestination}
						>
							Popular destinations
						</Title>

						<DestinationCards
							data={popularDestinations.list}
							destinationType="popular"
							isLoading={popularDestinations.status === 'loading'}
						/>

						<div className="text-center">
							<Button
								variant="outline"
								className={styles.seeAllBtn}
							>
								See all 200+ countries
							</Button>
						</div>
					</div>
					<div className={styles.multipleRegionsContainer}>
						<div className={styles.stayConnected}></div>
						<Title
							dualColor="primary"
							size="size40"
							position="center"
						>
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
								<SectionCard
									variant="secondary"
									icon={<SettingsIcon />}
									title="Choose Your Package"
									description="Select the perfect eSIM for your destination and data needs."
								/>
								<SectionCard
									variant="secondary"
									icon={<GlobeIcon />}
									title="Choose Your Package"
									description="Using your eSIM-compatible device to scan the QR code we send you via email and WhatsApp to quickly install your eSIM."
								/>
								<SectionCard
									variant="secondary"
									icon={<FeatherIcon />}
									title="Choose Your Package"
									description="When you arrive at your destination, switch to your eSIM
						as the primary data connection and enable roaming to
						join the local network seamlessly."
								/>
								<SectionCard
									variant="secondary"
									icon={<FeatherIcon />}
									title="Choose Your Package"
									description="When you arrive at your destination, switch to your eSIM
						as the primary data connection and enable roaming to
						join the local network seamlessly."
								/>
							</div>
						</div>
					</div>

					<div className={styles.chooseHowContainer}>
						<Curve variant="secondary" />
						<Title position={'center'} className={styles.title}>
							How TravelPulse eSIM works
						</Title>
						<div className={styles.secFeatureListContainer}>
							<div>
								<SectionCard
									icon={<MapIcon />}
									title="Choose Your Package"
									description="Select the perfect eSIM for your destination and data needs."
								/>
								<SectionCard
									icon={<QRcodeIcon />}
									title="Scan QR Code"
									description="Using your eSIM-compatible device to scan the QR code we send you via email and WhatsApp to quickly install your eSIM."
								/>
								<SectionCard
									icon={<NetworkIcon />}
									title="Activate and Connect"
									description="When you arrive at your destination, switch to your eSIM
						as the primary data connection and enable roaming to
						join the local network seamlessly."
								/>
							</div>

							<div className={styles.textCenter}>
								<Button
									variant="secondary"
									className={styles.AllDestinations}
								>
									View all destinations
								</Button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
