'use client';
import React, { useEffect } from 'react';
import { SimCard } from '../sim-card';
import { Title } from '../../common';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { fetchSims } from '@travelpulse/state/thunks';

export const MyESims: React.FC = () => {
	const { list, status } = useAppSelector((state) => state.account.sims.sims);
	const isLoading = status === 'loading';

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(
			fetchSims({
				size: 2,
			})
		);
	}, []);

	const onRecharge = (simId: number) => {
		console.log(`Recharge SIM with ID: ${simId}`);
	};

	const onViewDetails = (simId: number) => {
		console.log(`View details for SIM with ID: ${simId}`);
	};

	return (
		<div className="space-y-4 pt-9">
			<Title size="size19">My eSIMs</Title>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
				{!isLoading &&
					list.map((sim) => (
						<SimCard
							key={sim.id}
							data={sim}
							onRecharge={() => onRecharge(sim.id)}
							onViewDetails={() => onViewDetails(sim.id)}
						/>
					))}

				{isLoading && (
					<>
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="h-44 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
};
