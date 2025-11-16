import React from 'react';

const shimmer =
	'motion-safe:animate-pulse bg-slate-200/80 dark:bg-slate-700/60';

export function OrderSummarySkeleton() {
	return (
		<div className="space-y-6">
			{/* Title */}
			<div className={`h-5 w-32 rounded ${shimmer}`} />

			<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
				{/* Plan card list (single card skeleton, but visually matches) */}
				<div className="rounded-2xl bg-slate-50 p-4">
					{/* Top row: flag + name + actions */}
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-center gap-3">
							<div className={`h-6 w-9 rounded ${shimmer}`} />
							<div className="space-y-1">
								<div
									className={`h-4 w-40 rounded ${shimmer}`}
								/>
								<div
									className={`h-3 w-16 rounded ${shimmer}`}
								/>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div className={`h-4 w-4 rounded ${shimmer}`} />
							<div className={`h-4 w-4 rounded ${shimmer}`} />
						</div>
					</div>

					{/* Details list */}
					<div className="mt-4 grid gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={`detail-${i}`}
								className="flex items-center justify-between gap-4"
							>
								<div
									className={`h-3 w-28 rounded ${shimmer}`}
								/>
								<div
									className={`h-3 w-16 rounded ${shimmer}`}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Divider */}
				<div className={`mt-6 h-px w-full rounded ${shimmer}`} />

				{/* Summary rows */}
				<div className="mt-5 space-y-3">
					<div className="flex items-center justify-between">
						<div className={`h-4 w-20 rounded ${shimmer}`} />
						<div className={`h-4 w-12 rounded ${shimmer}`} />
					</div>
					<div className="flex items-center justify-between">
						<div className={`h-4 w-24 rounded ${shimmer}`} />
						<div className={`h-4 w-16 rounded ${shimmer}`} />
					</div>
					{/* Optional discount / bundle rows: just keep same pattern */}
					<div className="flex items-center justify-between">
						<div className={`h-4 w-24 rounded ${shimmer}`} />
						<div className={`h-4 w-20 rounded ${shimmer}`} />
					</div>
				</div>

				{/* Total row */}
				<div className="mt-4 flex items-center justify-between">
					<div className={`h-5 w-16 rounded ${shimmer}`} />
					<div className={`h-5 w-16 rounded ${shimmer}`} />
				</div>
			</div>

			{/* Note below card */}
			<div className="flex justify-center">
				<div className={`h-4 w-64 rounded ${shimmer}`} />
			</div>
		</div>
	);
}
