'use client';
import React, { useEffect, useState } from 'react';
import { ActivityLog, ESimTabs } from '@travelpulse/ui';
import { ApiService } from '@travelpulse/ui/state';
import {
	EsimListItem,
	EsimListResponse,
	SuccessResponse,
} from '@travelpulse/interfaces';

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

	const mapped = sims.map((s) => ({
		id: String(s.id),
		planName: s.providerOrder?.packageId || 'eSIM Plan',
		providerName: 'Provider',
		phoneNumber: s.msisdn || '',
		dataLeft: s.remaining ? `${s.remaining} GB` : '—',
		expiresOn: s.expiredAt
			? new Date(s.expiredAt).toLocaleDateString()
			: '—',
		isActive: s.status === 'ACTIVE',
	}));

	return (
		<div>
			{loading ? (
				<div>Loading eSIMs...</div>
			) : error ? (
				<div>{error}</div>
			) : (
				<ESimTabs sims={mapped} />
			)}

			<ActivityLog />
		</div>
	);
};

export default ESimsPage;
