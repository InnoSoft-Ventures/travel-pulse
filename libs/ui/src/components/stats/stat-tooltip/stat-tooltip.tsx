'use client';
import React from 'react';
import './style.module.scss';

interface DashboardTooltipProps {
	active?: boolean;
	payload?: { value?: number }[];
	label?: string | number;
}

export const StatTooltip: React.FC<DashboardTooltipProps> = ({
	active,
	payload,
	label,
}) => {
	if (!active || !payload || payload.length === 0) return null;

	const value = payload[0].value?.toString() ?? '';
	const labelText = label ?? '';

	return (
		<div className="bg-white text-slate-900 shadow-lg rounded-lg p-3 border border-gray-200 text-sm">
			<div className="statTooltipTitle">Point #{labelText}</div>
			<div className="statTooltipText">{value}</div>
		</div>
	);
};
