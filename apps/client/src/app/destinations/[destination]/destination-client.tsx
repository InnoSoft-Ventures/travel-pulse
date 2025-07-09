'use client';

import {
	Button,
	DestinationCards,
	DestinationHeader,
	Title,
	PlanTabs,
} from '@travelpulse/ui';

import styles from './destination.module.scss';
import {
	CountryPackageType,
	UIPlanTabs,
	UIPlanTabsMap,
} from '@travelpulse/interfaces';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { useEffect } from 'react';
import {
	getPopularCountries,
	getPopularDestinations,
	getRegions,
} from '@travelpulse/ui/thunks';
import { redirect, useRouter } from 'next/navigation';
import { destinationCopy, DestinationType } from '../destinationCopy';

interface DestinationPageProps {
	params: { destination: 'local' | 'regional' | 'global' };
}

const DestinationsPage = ({ params }: DestinationPageProps) => {
	const destination = params.destination.toLowerCase() as DestinationType;

	if (!['local', 'regional', 'global'].includes(destination)) {
		redirect('/destinations/local');
	}

	const copy = destinationCopy[destination];

	let currentTab: UIPlanTabs = UIPlanTabs.Local;
	switch (destination) {
		case 'local':
			currentTab = UIPlanTabs.Local;
			break;
		case 'regional':
			currentTab = UIPlanTabs.Regional;
			break;
		case 'global':
			currentTab = UIPlanTabs.Global;
			break;
	}

	const { popularDestinations } = useAppSelector((state) => state.products);
	const { popularCountries, regions } = useAppSelector(
		(state) => state.masterData
	);
	const router = useRouter();

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (popularDestinations.list.length === 0) {
			dispatch(getPopularDestinations({ size: 6 }));
		}
	}, [dispatch, popularDestinations.list]);

	useEffect(() => {
		switch (destination) {
			case 'local':
				dispatch(getPopularCountries());
				break;
			case 'regional':
				dispatch(getRegions());
				break;
			case 'global':
				break;
		}
	}, [dispatch, destination]);

	const onTabClick = (plan: UIPlanTabs) => {
		router.replace(UIPlanTabsMap[plan], {
			scroll: false,
		});
	};

	let data: CountryPackageType = [];

	switch (destination) {
		case 'local':
			data = popularCountries.list;
			break;
		case 'regional':
			data = regions.list;
			break;
		case 'global':
			break;
	}

	return (
		<>
			<DestinationHeader
				title="Discover the power of International eSIM"
				subTitle="Explore the world without losing connection. Choose from hundreds of data plans and enjoy fast, seamless eSIM connectivity tailored for travelers and digital nomads."
			/>
			<main className={styles.destinationMain}>
				<Title position="center" size="size40">
					Popular destinations
				</Title>

				<div className={styles.popularDestinationContainer}>
					<DestinationCards
						data={popularDestinations.list}
						destinationType="popular"
						isLoading={popularDestinations.status === 'loading'}
					/>
				</div>

				<Title position="center" size="size40">
					Stay connected globally
				</Title>
				<Title
					position="center"
					size="size16"
					className={styles.subTitle}
				>
					{copy.subtitle}
				</Title>

				<div className={styles.planTabsContainer}>
					<PlanTabs onChange={onTabClick} activePlan={currentTab} />
				</div>

				<div className={styles.popularDestinationContainer}>
					<Title size="size20">{copy.sectionTitle}</Title>
					<DestinationCards data={data} destinationType="local" />
					{copy.buttonText && (
						<div className="text-center">
							<Button
								variant="outline"
								className={styles.seeAllBtn}
							>
								{copy.buttonText}
							</Button>
						</div>
					)}
				</div>

				<div>
					<Title position="center" size="size35">
						Ready to get started?
					</Title>
					<Title
						position="center"
						size="size16"
						className={styles.getYourEsimSubTitle}
					>
						Get your eSIM installed in few steps and enjoy
						uninterrupted data wherever you are.
					</Title>

					<div className={styles.getStartedBtnContainer}>
						<Button size="lg">Get your eSIM now</Button>
					</div>
				</div>
			</main>
		</>
	);
};

export default DestinationsPage;
