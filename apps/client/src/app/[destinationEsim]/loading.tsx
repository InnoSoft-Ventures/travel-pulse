import { DestinationHeader, PlanCardSkeleton } from '@travelpulse/ui';
import { SHIMMER } from '@travelpulse/utils';
import React from 'react';

const shimmer = SHIMMER;

export default function CountryPageSkeleton() {
	return (
		<div className="space-y-10">
			{/* Destination Header (hero) */}
			<DestinationHeader
				title={
					<div
						className={`h-10 w-[450px] mx-auto rounded ${shimmer}`}
					/>
				}
				subTitle={
					<div
						className={`h-7 w-[520px] mx-auto rounded ${shimmer}`}
					/>
				}
				skeleton={
					<div className="mt-[70px] mx-auto flex justify-center items-center gap-5">
						<div
							className={`h-11 w-full max-w-[380px] rounded-full ${shimmer}`}
						/>
						<div
							className={`h-11 w-full max-w-[380px] rounded-full ${shimmer}`}
						/>
						<div
							className={`h-11 w-full max-w-[158px] rounded-full ${shimmer}`}
						/>
					</div>
				}
			/>

			{/* Body container */}
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				{/* Breadcrumb */}
				<div className="flex items-center mb-[30px] gap-2 text-slate-500">
					<div className={`h-4 w-24 rounded ${shimmer}`} />
					<div className={`h-4 w-3 rounded ${shimmer}`} />
					<div className={`h-4 w-32 rounded ${shimmer}`} />
				</div>

				{/* Titles */}
				<div className="mt-4 space-y-1">
					<div className={`h-7 w-64 rounded ${shimmer}`} />
					<div className={`h-4 w-96 rounded ${shimmer}`} />
				</div>

				{/* Flex layout: image left, content right */}
				<div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
					{/* Image card */}
					<div className="bg-white dark:bg-slate-900 dark:ring-slate-800">
						<div
							className={`rounded-[75px_75px_75px_0] h-[500px] w-full max-w-[415px] ${shimmer}`}
						/>
					</div>

					{/* Text + plans */}
					<div className="space-y-6">
						{/* Note + benefits + checker */}
						<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
							<div
								className={`h-4 w-[420px] rounded ${shimmer}`}
							/>
							<div className="mt-4 grid gap-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<div
										key={`benefit-${i}`}
										className="flex items-start gap-3"
									>
										<div
											className={`mt-1 h-3 w-3 rounded-full ${shimmer}`}
										/>
										<div
											className={`h-4 w-[520px] rounded ${shimmer}`}
										/>
									</div>
								))}
							</div>

							{/* Compatibility checker button */}
							<div className="mt-4 flex justify-end">
								<div
									className={`h-10 w-40 rounded-full ${shimmer}`}
								/>
							</div>
						</div>

						{/* Date/Length indicator */}
						<div className="flex items-center gap-3">
							<div
								className={`h-10 w-64 rounded-full ${shimmer}`}
							/>
							<div className={`h-4 w-40 rounded ${shimmer}`} />
						</div>

						{/* Plans grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, idx) => (
								<PlanCardSkeleton
									shimmer={shimmer}
									key={`plan-${idx}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* How It Works section */}
			<section className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white p-8 ring-1 ring-slate-100 dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
					<div className="mx-auto max-w-4xl">
						<div className={`h-7 w-[420px] rounded ${shimmer}`} />
						<div className="mt-6 grid gap-6 sm:grid-cols-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={`step-${i}`}
									className="flex flex-col items-center gap-3 rounded-2xl p-4 text-center"
								>
									<div
										className={`h-12 w-12 rounded-xl ${shimmer}`}
									/>
									<div
										className={`h-5 w-40 rounded ${shimmer}`}
									/>
									<div
										className={`h-4 w-48 rounded ${shimmer}`}
									/>
								</div>
							))}
						</div>
						<div className="mt-6 flex justify-center">
							<div
								className={`h-10 w-44 rounded-full ${shimmer}`}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
