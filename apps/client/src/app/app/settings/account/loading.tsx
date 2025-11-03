import React from 'react';

// Consistent shimmer with reduced-motion + dark mode
const shimmer = 'motion-safe:animate-pulse bg-slate-200';

/**
 * AccountSettingsSkeleton (matches current UI)
 * - Header + horizontal tabs (Account | Security | Orders | Cards)
 * - Account Information card: left form column, right avatar, footer buttons
 * - Security card, Orders table, Cards list (as in screenshot)
 */
export default function AccountSettingsSkeleton() {
	return (
		<div className="space-y-4">
			{/* Account Information card */}
			<div className="bg-white rounded-md shadow-sm px-8 py-10 mt-8 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
				{/* Title + subtitle */}
				<div className="space-y-2">
					<div className={`h-6 w-52 rounded ${shimmer}`} />
					<div className={`h-4 w-[360px] rounded ${shimmer}`} />
				</div>

				{/* Form grid: left fields (max-w-md), right avatar */}
				<div className="mt-9">
					<div className="flex gap-8 flex-wrap">
						{/* Left column */}
						<div className="flex flex-col gap-6 w-full max-w-md">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={`field-${i}`} className="space-y-2">
									<div
										className={`h-4 w-28 rounded ${shimmer}`}
									/>
									<div
										className={`h-11 w-full rounded-md ${shimmer}`}
									/>
								</div>
							))}
						</div>
						{/* Right column: avatar */}
						<div className="flex flex-col gap-6 justify-between">
							<div
								className={`w-[150px] h-[150px] rounded-full ${shimmer}`}
							/>
						</div>
					</div>
				</div>

				{/* Footer actions */}
				<div className="flex gap-4 justify-end mt-10">
					<div className={`h-10 w-24 rounded-full ${shimmer}`} />
					<div className={`h-10 w-32 rounded-full ${shimmer}`} />
				</div>
			</div>
		</div>
	);
}
