import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './style.module.scss';

interface UsageStatCardProps {
	title: string;
	value: string;
	description: string;
	trend: string;
	trendType: 'positive' | 'negative';
	graph: React.ReactNode;
	icon?: React.ReactNode;
}

export const UsageStatCard = ({
	title,
	value,
	description,
	trend,
	trendType,
	graph,
	icon,
}: UsageStatCardProps) => {
	return (
		<div className="w-[389px] h-[158px] bg-white rounded-lg shadow-md px-6 py-5 flex justify-between items-start">
			<div className="flex flex-col gap-1">
				<div className={styles.statTitle}>{title}</div>
				<div className={styles.statValue}>{value}</div>
				<div className={styles.statDescription}>{description}</div>
				<div className="flex items-center gap-1 mt-2">
					{trendType === 'positive' ? (
						<ArrowUpRight size={14} className="text-green-500" />
					) : (
						<ArrowDownRight size={14} className="text-red-500" />
					)}
					<span
						className={`text-xs font-medium ${
							trendType === 'positive'
								? 'text-green-500'
								: 'text-red-500'
						}`}
					>
						{trend}
					</span>
				</div>
			</div>

			<div className="relative">
				{/* Top-right icon */}
				{icon && <div className="absolute top-0 right-0">{icon}</div>}

				{/* Graph area */}
				<div className="w-[155px] h-[102px] rounded-md overflow-hidden mt-4">
					{graph}
				</div>
			</div>
		</div>
	);
};
