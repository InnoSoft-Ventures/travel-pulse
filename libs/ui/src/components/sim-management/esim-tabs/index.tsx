'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../common';
import { SimCard } from '../sim-card';
import { SimInfo } from '../sim-interface';

interface ESimTabsProps {
	sims: SimInfo[];
}

export const ESimTabs = ({ sims }: ESimTabsProps) => {
	const onRecharge = (simId: string) => {
		console.log(`Recharge SIM with ID: ${simId}`);
	};

	const onViewDetails = (simId: string) => {
		console.log(`View details for SIM with ID: ${simId}`);
	};

	return (
		<div>
			<Tabs defaultValue="active" className="space-y-6">
				<TabsList className="grid max-w-2xl grid-cols-3 h-auto">
					<TabsTrigger
						value="active"
						className="flex items-center gap-2 py-[8px]"
					>
						Active
					</TabsTrigger>
					<TabsTrigger
						value="inactive"
						className="flex items-center gap-2 py-[8px]"
					>
						Inactive
					</TabsTrigger>
					<TabsTrigger
						value="all"
						className="flex items-center gap-2 py-[8px]"
					>
						All eSIMs
					</TabsTrigger>
				</TabsList>
				<TabsContent value="active" className="space-y-6">
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
				</TabsContent>
				<TabsContent value="inactive" className="space-y-6">
					{/* Inactive eSIMs content goes here */}
					<p>Inactive eSIMs will be displayed here.</p>
				</TabsContent>
				<TabsContent value="all" className="space-y-6">
					{/* All eSIMs content goes here */}
					<p>All eSIMs will be displayed here.</p>
				</TabsContent>
			</Tabs>
		</div>
	);
};
