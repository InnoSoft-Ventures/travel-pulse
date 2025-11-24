import React from 'react';
import { SHIMMER } from '@travelpulse/utils';

interface PlanCardSkeletonProps {
	shimmer?: string;
}

export const PlanCardSkeleton = (props: PlanCardSkeletonProps) => {
	const { shimmer = SHIMMER } = props;

	return (
		<div className="rounded-2xl max-w-[280px] w-full bg-white p-[15px] pb-[18px] shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
			{/* Country pill */}
			<div className="flex items-center justify-between">
				<div className={`h-6 w-24 rounded-full ${shimmer}`} />
				<div className={`h-4 w-6 rounded ${shimmer}`} />
			</div>
			<div className="mt-4 mb-[25px] grid grid-cols-2 gap-3">
				{/* Left spec stack */}
				<div className="space-y-4">
					<div className={`h-4 w-10 rounded ${shimmer}`} />
					<div className={`h-4 w-20 rounded ${shimmer}`} />
					<div className={`h-4 w-16 rounded ${shimmer}`} />
					<div className={`h-4 w-24 rounded ${shimmer}`} />
				</div>
				{/* Price block */}
				<div className="space-y-2 justify-self-end text-right">
					<div className={`h-5 w-24 rounded ${shimmer}`} />
					<div className={`h-4 w-28 rounded ${shimmer}`} />
				</div>
			</div>

			<hr className="h-px border-0 bg-[#e6e4f2]" />

			{/* Actions */}
			<div className="mt-[1.68rem] flex items-center justify-between">
				<div className={`h-9 w-28 rounded-full ${shimmer}`} />
				<div className={`h-9 w-24 rounded-full ${shimmer}`} />
			</div>
		</div>
	);
};
