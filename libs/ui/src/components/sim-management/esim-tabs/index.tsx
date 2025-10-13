'use client';
import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../common';
import { SimCard } from '../sim-card';

import styles from './styles.module.scss';
import { SIMInfo } from '@travelpulse/interfaces';
import { useRouter } from 'next/navigation';

interface ESimTabsProps {
	sims: SIMInfo[];
}

export const ESimTabs = ({ sims }: ESimTabsProps) => {
	const router = useRouter();

	const active = useMemo(
		() => sims.filter((s) => s.status === 'ACTIVE'),
		[sims]
	);
	const inactive = useMemo(
		() => sims.filter((s) => s.status === 'NOT_ACTIVE'),
		[sims]
	);

	const onRecharge = (simId: number) => {
		console.log(`Recharge SIM with ID: ${simId}`);
	};

	const onViewDetails = (sim: SIMInfo) => {
		// you can deep-link to plan detail using pkg if you want
		console.log(`View details for SIM with ID: ${sim.id}`, sim);
		router.push(`/app/esims/${sim.id}`);
	};

	// const onInstallShare = (simId: string) => {
	//   console.log(`Install/share flow for SIM ${simId}`);
	// };

	// const onToggleRenew = (simId: string, next: boolean) => {
	//   console.log(`Auto-renew for ${simId}: ${next}`);
	//   // TODO hook to backend
	// };

	const renderGrid = (arr: SIMInfo[]) =>
		arr.length ? (
			<div className={styles.simCardGrid}>
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
