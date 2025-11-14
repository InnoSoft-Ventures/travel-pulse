import { Suspense } from 'react';
import { CountryProduct, ResponseData } from '@travelpulse/interfaces';
import { APIRequest } from '@travelpulse/api-service';

import {
	Hero,
	Button,
	Title,
	DestinationCards,
	SearchAndCalendar,
	SectionCard,
	Testimonial,
	HowItWorks,
} from '@travelpulse/ui';

import Characters from '@/assets/characters.svg';
import YellowStar from '@/assets/yellow-star.svg';
import GlobeIcon from '@/assets/globe.svg';
import FeatherIcon from '@/assets/feather.svg';
import SettingsIcon from '@/assets/settings-gear.svg';

import styles from './home.module.scss';
import { HeroCtaButton } from './hero-cta-client';
import {
	PopularDestinationsSection,
	MultipleRegionsSection,
} from './home-page-server';

export default async function HomePage() {
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
									<HeroCtaButton
										className={styles.searchBtn}
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
						<Suspense
							fallback={
								<>
									<Title
										size="size20"
										className={styles.popularDestination}
									>
										Popular destinations
									</Title>
									<div className="py-8 text-center text-gray-500">
										Loading destinations...
									</div>
								</>
							}
						>
							<PopularDestinationsSection />
						</Suspense>

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
							<Suspense
								fallback={
									<>
										<Title
											size="size20"
											className={
												styles.popularDestination
											}
										>
											Exploring Multiple Regions
										</Title>
										<div className="py-8 text-center text-gray-500">
											Loading regions...
										</div>
									</>
								}
							>
								<MultipleRegionsSection />
							</Suspense>

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

					<HowItWorks />

					<div className={styles.testimonialContainer}>
						<Title
							position="center"
							size="size40"
							className={styles.title}
						>
							Testimonials
						</Title>
						<Title
							size="size16"
							position="center"
							className={styles.subTitle}
						>
							Real stories from satisfied eSIM customers
						</Title>
						<div className={styles.ellipse_2}></div>
						<div className={styles.ellipse_7}></div>
						<div className={styles.ellipse_6}></div>

						<div className={styles.testimonialListContainer}>
							<Testimonial />
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
