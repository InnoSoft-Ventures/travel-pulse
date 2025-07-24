'use client';
import React from 'react';
import { SimCard } from '../sim-card';
import { Title } from '../../common';
import { SimInfo } from '../sim-interface';

interface MyESimsProps {
	sims: SimInfo[];
}

export const MyESims: React.FC<MyESimsProps> = ({ sims }) => {
	const onRecharge = (simId: string) => {
		console.log(`Recharge SIM with ID: ${simId}`);
	};

	const onViewDetails = (simId: string) => {
		console.log(`View details for SIM with ID: ${simId}`);
	};

	return (
		<div className="space-y-4 pt-9">
			<Title size="size19">My eSIMs</Title>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
				{sims.map((sim) => (
					<SimCard
						key={sim.id}
						data={sim}
						onRecharge={() => onRecharge(sim.id)}
						onViewDetails={() => onViewDetails(sim.id)}
					/>
				))}
			</div>
		</div>
	);
};
