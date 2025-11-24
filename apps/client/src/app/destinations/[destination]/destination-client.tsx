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
	UIPlanType,
	UIPlanTypeMap,
} from '@travelpulse/interfaces';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { useEffect, useState } from 'react';
import {
	getCountries,
	getPopularCountries,
	getPopularDestinations,
	getRegions,
} from '@travelpulse/ui/thunks';
import { redirect, useRouter } from 'next/navigation';
import { destinationCopy, DestinationType } from '../destinationCopy';
import { elementScrollTo } from '@travelpulse/utils';

interface DestinationPageProps {
	params: { destination: 'local' | 'regional' | 'global' };
}

const DestinationsPage = ({ params }: DestinationPageProps) => {
	const destination = params.destination.toLowerCase() as DestinationType;

	if (!['local', 'regional', 'global'].includes(destination)) {
		redirect('/destinations/local');
	}

	const copy = destinationCopy[destination];

	let currentTab: UIPlanType = UIPlanType.Local;
	switch (destination) {
		case 'local':
			currentTab = UIPlanType.Local;
			break;
		case 'regional':
			currentTab = UIPlanType.Regional;
			break;
		case 'global':
			currentTab = UIPlanType.Global;
			break;
	}

	const [viewAll, setViewAll] = useState(false);
	const { popularDestinations } = useAppSelector(
		(state) => state.app.products
	);
	const { popularCountries, regions, countries } = useAppSelector(
		(state) => state.app.masterData
	);
	const router = useRouter();

	const dispatch = useAppDispatch();

	function onViewAll() {
		setViewAll(true);

		if (destination === 'local') {
			dispatch(getCountries(''));
			return;
		}
	}

	useEffect(() => {
		// scroll to destination section if coming from plan tabs
		const hash = window.location.hash;

		if (hash === '#destination') {
			const element = document.getElementById('destination-section');

			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });

				onViewAll();

				// Remove hash without affecting browser history
				setTimeout(() => {
					router.replace(window.location.pathname, { scroll: false });
				}, 1000);
			}
		}
	}, []);

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
				dispatch(getRegions({}));
				break;
			case 'global':
				break;
		}
	}, [dispatch, destination]);

	const onTabClick = (plan: UIPlanType) => {
		router.replace(UIPlanTypeMap[plan], {
			scroll: false,
		});
	};

	let data: CountryPackageType = [];

	switch (destination) {
		case 'local':
			{
				if (!viewAll) {
					data = popularCountries.list;
				} else {
					data = countries.list;
				}
			}
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
				enableSearch={false}
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

				<div
					className={styles.planTabsContainer}
					id="destination-title"
				>
					<PlanTabs onChange={onTabClick} activePlan={currentTab} />
				</div>

				<div
					className={styles.popularDestinationContainer}
					id="destination-section"
				>
					<Title size="size20">{copy.sectionTitle}</Title>
					<DestinationCards
						data={data}
						destinationType={
							destination === 'regional' ? 'region-link' : 'local'
						}
					/>
					{copy.buttonText && !viewAll && (
						<div className="text-center">
							<Button
								variant="outline"
								className={styles.seeAllBtn}
								onClick={onViewAll}
								isLoading={countries.status === 'loading'}
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
						<Button
							size="lg"
							onClick={() => elementScrollTo('destination-title')}
						>
							Get your eSIM now
						</Button>
					</div>
				</div>
			</main>
		</>
	);
};

export default DestinationsPage;
