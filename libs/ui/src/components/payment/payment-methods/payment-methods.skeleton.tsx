import React from 'react';

const shimmer =
	'motion-safe:animate-pulse bg-slate-200/80 dark:bg-slate-700/60';

export function PaymentMethodsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Heading + subtitle */}
			<div>
				<div className={`h-5 w-40 rounded ${shimmer}`} />
				<div className={`mt-2 h-4 w-[320px] rounded ${shimmer}`} />

				{/* Payment method card */}
				<div className="mt-5 rounded-2xl border border-violet-200 bg-white p-4 shadow-sm">
					<div className="flex items-center gap-4">
						{/* Icon */}
						<div className={`h-10 w-14 rounded-xl ${shimmer}`} />

						{/* Text stack */}
						<div className="flex-1 space-y-2">
							<div className={`h-4 w-40 rounded ${shimmer}`} />
							<div className={`h-3 w-72 rounded ${shimmer}`} />
						</div>

						{/* Select card button */}
						<div className={`h-10 w-28 rounded-full ${shimmer}`} />
					</div>
				</div>
			</div>

			{/* Security / compatibility + terms text */}
			<div className="space-y-3">
				<div className="flex items-start gap-3">
					<div className={`mt-1 h-5 w-5 rounded-md ${shimmer}`} />
					<div className={`h-4 w-full max-w-xl rounded ${shimmer}`} />
				</div>
				<div className={`h-4 w-full max-w-lg rounded ${shimmer}`} />
			</div>

			{/* Pay button */}
			<div>
				<div className={`h-12 w-full rounded-full ${shimmer}`} />
			</div>

			{/* SSL notice */}
			<div className="flex justify-center">
				<div className={`h-4 w-80 rounded ${shimmer}`} />
			</div>
		</div>
	);
}
