import React from 'react';

// Skeleton shimmer utility
const shimmer = 'animate-pulse bg-slate-200';

/**
 * DashboardSkeleton
 * Mirrors the current UI layout:
 * - Left column (2fr): Title + DataUsageChart card, followed by MyESims list
 * - Right column (1fr): UsageStats card stacked above Notifications card
 *
 * Notes:
 * - Uses responsive grid with xl:grid-cols-[2fr_1fr] to match the page
 * - Card shells and element proportions reflect the live components closely
 * - Keep heights stable to limit CLS during hydration
 */
export function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			{/* Top-level layout */}
			<div className="grid gap-6 grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
				{/* LEFT: Chart + My eSIMs */}
				<div className="space-y-6">
					{/* Data Usage Chart card */}
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
						{/* Title */}
						<div className={`h-6 w-56 rounded ${shimmer}`} />
						{/* Chart area */}
						<div
							className={`mt-4 h-[260px] w-full rounded-xl ${shimmer}`}
						/>
						{/* Legend / axis hint bars */}
						<div className="mt-4 grid grid-cols-3 gap-3">
							<div className={`h-3 w-20 rounded ${shimmer}`} />
							<div className={`h-3 w-16 rounded ${shimmer}`} />
							<div className={`h-3 w-24 rounded ${shimmer}`} />
						</div>
					</div>

					{/* My eSIMs card */}
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
						<div className="flex items-center justify-between">
							<div className={`h-6 w-40 rounded ${shimmer}`} />
							{/* CTA button shell */}
							<div
								className={`h-10 w-36 rounded-xl ${shimmer}`}
							/>
						</div>

						{/* eSIM items (match two items as per sample) */}
						<div className="mt-4 grid gap-4 md:grid-cols-2">
							{Array.from({ length: 2 }).map((_, i) => (
								<div
									key={`esim-item-${i}`}
									className="space-y-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800"
								>
									{/* Plan name */}
									<div
										className={`h-5 w-52 rounded ${shimmer}`}
									/>
									{/* Provider + number */}
									<div className="flex items-center justify-between">
										<div
											className={`h-4 w-32 rounded ${shimmer}`}
										/>
										<div
											className={`h-4 w-28 rounded ${shimmer}`}
										/>
									</div>
									{/* Badges / meta */}
									<div className="grid gap-2 sm:grid-cols-2">
										<div
											className={`h-8 rounded-lg ${shimmer}`}
										/>
										<div
											className={`h-8 rounded-lg ${shimmer}`}
										/>
									</div>
									{/* Actions / footer */}
									<div className="flex items-center justify-between pt-1">
										<div
											className={`h-4 w-24 rounded ${shimmer}`}
										/>
										<div
											className={`h-9 w-28 rounded-xl ${shimmer}`}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* RIGHT: Metric cards (2) + Notifications stacked */}
				<div className="space-y-6">
					{/* Metric cards container */}
					<div className="grid gap-6">
						{/* Two metric cards, stacked vertically */}
						{Array.from({ length: 2 }).map((_, idx) => (
							<div
								key={`metric-card-${idx}`}
								className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
							>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div
											className={`h-4 w-40 rounded ${shimmer}`}
										/>
										<div
											className={`h-8 w-24 rounded ${shimmer}`}
										/>
										<div
											className={`h-3 w-40 rounded ${shimmer}`}
										/>
										{/* trend pill */}
										<div
											className={`h-5 w-28 rounded-full ${shimmer}`}
										/>
									</div>
									{/* mini sparkline area */}
									<div
										className={`h-16 w-28 rounded-lg ${shimmer}`}
									/>
								</div>
							</div>
						))}
					</div>

					{/* Notifications card */}
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
						<div className={`h-6 w-44 rounded ${shimmer}`} />
						<div className="mt-4 space-y-5">
							{Array.from({ length: 5 }).map((_, idx) => (
								<div key={`notif-${idx}`} className="space-y-2">
									{/* title line */}
									<div
										className={`h-4 w-[88%] rounded ${shimmer}`}
									/>
									{/* two meta lines */}
									<div
										className={`h-3 w-40 rounded ${shimmer}`}
									/>
									<div
										className={`h-3 w-24 rounded ${shimmer}`}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
