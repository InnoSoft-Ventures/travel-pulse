'use client';
import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../common';
import { SimCard } from '../sim-card';
import { SimInfo } from '../sim-interface';

interface ESimTabsProps {
	sims: SimInfo[];
}

export const ESimTabs = ({ sims }: ESimTabsProps) => {
	const active = useMemo(() => sims.filter((s) => s.isActive), [sims]);
	const inactive = useMemo(() => sims.filter((s) => !s.isActive), [sims]);

	const onRecharge = (simId: string) => {
		console.log(`Recharge SIM with ID: ${simId}`);
	};

	const onViewDetails = (sim: SimInfo) => {
		// you can deep-link to plan detail using pkg if you want
		console.log(`View details for SIM with ID: ${sim.id}`, sim);
	};

	// const onInstallShare = (simId: string) => {
	//   console.log(`Install/share flow for SIM ${simId}`);
	// };

	// const onToggleRenew = (simId: string, next: boolean) => {
	//   console.log(`Auto-renew for ${simId}: ${next}`);
	//   // TODO hook to backend
	// };

	const renderGrid = (arr: SimInfo[]) =>
		arr.length ? (
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
				{arr.map((sim) => (
					<SimCard
						key={sim.id}
						data={sim}
						onRecharge={() => onRecharge(sim.id)}
						onViewDetails={() => onViewDetails(sim)}
						// onInstallShare={() => onInstallShare(sim.id)}
						// onToggleRenew={(next) => onToggleRenew(sim.id, next)}
					/>
				))}
			</div>
		) : (
			<div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
				No eSIMs in this tab.
			</div>
		);

	return (
		<div className="space-y-6">
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
					{renderGrid(active)}
				</TabsContent>

				<TabsContent value="inactive" className="space-y-6">
					{renderGrid(inactive)}
				</TabsContent>

				<TabsContent value="all" className="space-y-6">
					{renderGrid(sims)}
				</TabsContent>
			</Tabs>
		</div>
	);
};
