'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ActivityLog, ESimTabs } from '@travelpulse/ui';
import { ApiService } from '@travelpulse/ui/state';
import {
	EsimListItem,
	EsimListResponse,
	SuccessResponse,
} from '@travelpulse/interfaces';

export type SimInfo = {
	id: string;
	planName: string;
	providerName: string;
	phoneNumber: string;
	dataLeft: string; // e.g. "1.5 GB" or "—"
	expiresOn: string; // display date or "—"
	isActive: boolean;
	// optional UX extras
	validityDays?: number | null;
	supportsVoice?: boolean;
	supportsSms?: boolean;
	autoRenew?: boolean;
	packageId?: number;
};

const ESimsPage = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sims, setSims] = useState<EsimListItem[]>([]);

	useEffect(() => {
		setLoading(true);
		setError(null);

		ApiService.get('/esims', {
			params: { status: 'all', page: 1, size: 20 },
		})
			.then((res) => {
				const parsed = res.data as SuccessResponse<EsimListResponse>;
				setSims(parsed.data.items || []);
			})
			.catch((err) => {
				console.error('Failed to load eSIMs', err);
				setError('Failed to load eSIMs');
			})
			.finally(() => setLoading(false));
	}, []);

	const mapped: SimInfo[] = useMemo(
		() =>
			sims.map((s) => ({
				id: String(s.id),
				planName: s.providerOrder?.packageId || 'eSIM Plan',
				providerName: 'Provider',
				phoneNumber: s.msisdn || '',
				dataLeft: s.remaining ? `${s.remaining} GB` : '—',
				expiresOn: s.expiredAt
					? new Date(s.expiredAt).toLocaleDateString()
					: '—',
				isActive: s.status === 'ACTIVE',
			})),
		[sims]
	);

	return (
		<div className="space-y-6">
			{loading ? (
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
					{error}
				</div>
			) : (
				<ESimTabs sims={mapped} />
			)}

			<ActivityLog />
		</div>
	);
};

export default ESimsPage;
