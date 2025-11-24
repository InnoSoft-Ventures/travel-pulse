'use client';

import React, { useEffect } from 'react';
import { ESimTabs } from '@travelpulse/ui';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';

import { fetchSims } from '@travelpulse/ui/thunks';

const ESimsPage = () => {
	const dispatch = useAppDispatch();
	const { sims } = useAppSelector((state) => state.account.sims);
	const { status, error, list } = sims;

	useEffect(() => {
		dispatch(fetchSims({}));
	}, []);

	return (
		<div className="space-y-6">
			{status === 'loading' ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="h-44 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse"
						/>
					))}
				</div>
			) : error ? (
				<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
					{error.toString()}
				</div>
			) : (
				<ESimTabs sims={list} />
			)}

			{/* <ActivityLog /> */}
		</div>
	);
};

export default ESimsPage;
