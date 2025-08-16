'use client';

import { Suspense, useMemo, useState } from 'react';
import styles from './country.module.scss';
import Image from 'next/image';
import toronto from '@/assets/toronto_bg.jpg';
import {
	PlanDetailModal,
	Breadcrumb,
	CompatibilityChecker,
	DestinationHeader,
	Title,
	HowItWorks,
} from '@travelpulse/ui';
import {
	Continent,
	Country,
	PackageInterface,
	UIPlanType,
	UIPlanTypeMap,
} from '@travelpulse/interfaces';
import PlanList from './PlanList';
import { dateJs } from '@travelpulse/utils';
import { useAppSelector } from '@travelpulse/ui/state';

interface Props {
	destination: Country | Continent;
	targetDestination: UIPlanType;
}

const DestinationEsimContent = ({ destination, targetDestination }: Props) => {
	const { dates: selectedDates } = useAppSelector(
		(state) => state.app.metaData
	);

	const today = useMemo(() => dateJs(), []);
	const startDate = selectedDates?.start
		? dateJs(selectedDates.start)
		: today;
	const endDate = selectedDates?.end
		? dateJs(selectedDates.end)
		: today.add(7, 'day');

	const [selectedPlan, setSelectedPlan] = useState<PackageInterface | null>(
		null
	);

	const handlePlanDetails = (plan: PackageInterface) => {
		setSelectedPlan(plan);
	};

	return (
		<>
			<DestinationHeader
				title={`eSIM plans for ${destination.name}`}
				subTitle={
					<>
						Discover <strong>{destination.name}</strong> with
						seamless connectivity — no roaming fees, no
						interruptions, and effortless eSIM setup.
					</>
				}
			/>
			<div className={styles.countryContainer}>
				<section className={styles.content}>
					<Breadcrumb
						className={styles.breadcrumbNav}
						items={[
							{
								label: 'Destinations',
								href: `/destinations/${UIPlanTypeMap[targetDestination]}`,
							},
							{
								label: `${destination.name} eSIMs`,
							},
						]}
					/>
					<Title size="size35">Available eSIM plans</Title>
					<Title size="size16" className={styles.subTitle}>
						Choose from our list of {destination.name} eSIM plans
					</Title>

					<div className={styles.flexLayout}>
						<div className={styles.imageContainer}>
							<Image
								src={toronto}
								alt={`${destination.name} tower`}
								width={300}
								height={400}
								className={styles.countryImage}
							/>
						</div>
						<div className={styles.textContainer}>
							<div className={styles.contentNote}>
								Note: Before making a purchase, make sure your
								device is eSIM compatible and not network
								locked.
							</div>
							<div className={styles.benefitsContainer}>
								<ul className={styles.benefitsList}>
									<li>
										<span>Affordable data plans</span> —
										{/* Fetch cheapest package price for this country */}
										starting from{' '}
										<strong>
											$
											{destination.cheapestPackagePrice ||
												1}{' '}
											USD
										</strong>
									</li>
									<li>
										Reliable connection from the best
										networks.
									</li>
									<li>You keep your original number.</li>
									<li>
										Compatible with eSIM-enabled
										smartphones.
									</li>
								</ul>

								<div className={styles.compatibilityCheck}>
									<CompatibilityChecker />
								</div>
							</div>

							<Suspense fallback={<p>Loading plans...</p>}>
								<PlanList
									targetDestination={targetDestination}
									slug={destination.slug}
									handlePlanDetails={handlePlanDetails}
									startDate={startDate}
									endDate={endDate}
								/>
							</Suspense>
						</div>
					</div>
				</section>
			</div>

			<HowItWorks
				className={styles.howItWorks}
				destinationName={destination.name}
			/>

			{selectedPlan && (
				<PlanDetailModal
					open={Boolean(selectedPlan)}
					data={selectedPlan as PackageInterface}
					startDate={startDate}
					endDate={endDate}
					onClose={() => setSelectedPlan(null)}
				/>
			)}
		</>
	);
};

export default DestinationEsimContent;
