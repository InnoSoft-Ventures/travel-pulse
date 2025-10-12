'use client';
import React, { useMemo } from 'react';
import { Switch } from '@heroui/switch';
import { Button } from '../../common';
import styles from './style.module.scss';

import WifiIcon from '../../../assets/wifi.svg';
import PhoneIcon from '../../../assets/phone.svg';
import { SimInfo } from '../sim-interface';

export type SimCardProps = {
	data: SimInfo;
	onRecharge: () => void;
	onViewDetails: () => void;
	onInstallShare?: () => void;
	onToggleRenew?: (next: boolean) => void;
};

export const SimCard: React.FC<SimCardProps> = ({
	data,
	onRecharge,
	onViewDetails,
	onInstallShare,
	onToggleRenew,
}) => {
	const {
		providerName,
		planName,
		phoneNumber,
		dataLeft,
		expiresOn,
		isActive,
		// validityDays,
		// supportsVoice,
		// supportsSms,
		// autoRenew,
	} = data;

	const autoRenew = false;

	const statusCls = isActive
		? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
		: 'bg-gray-200 text-gray-600 border border-gray-300';

	const cardStateCls = isActive ? '' : 'opacity-[0.55]';

	const renewLabel = useMemo(() => (autoRenew ? 'On' : 'Off'), [autoRenew]);

	return (
		<article
			className={[
				'bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow',
				cardStateCls,
			].join(' ')}
			aria-live="polite"
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="text-[18px] leading-6 font-extrabold text-slate-900 truncate">
						{planName}
					</h3>
					<p className="text-gray-500 text-sm">{providerName}</p>
				</div>

				<span
					className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusCls}`}
					aria-label={`Status: ${isActive ? 'Active' : 'Inactive'}`}
				>
					<WifiIcon
						fill="none"
						stroke="currentColor"
						data-active={isActive}
						className={styles.wifiIcon}
					/>
					<span className="text-xs font-semibold">
						{isActive ? 'Active' : 'Inactive'}
					</span>
				</span>
			</div>

			{/* Phone */}
			<div className="flex items-center mt-4 text-gray-900">
				<PhoneIcon
					stroke="currentColor"
					className="text-indigo-600 mr-2"
				/>
				<span className="font-medium">{phoneNumber || '—'}</span>
			</div>

			{/* KPI tiles */}
			<div className="mt-4 grid grid-cols-2 gap-3">
				<div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
					<div className="text-xs text-gray-500">Data left</div>
					<div className="font-extrabold text-[22px] leading-7">
						{dataLeft}
					</div>
				</div>
				<div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
					<div className="text-xs text-gray-500">Expires on</div>
					<div className="font-extrabold text-[18px] leading-7">
						{expiresOn}
					</div>
				</div>
			</div>

			{/* Meta pills (optional) */}
			{/* {(validityDays != null || supportsVoice || supportsSms) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {validityDays != null && (
            <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 text-xs bg-gray-50">
              {validityDays} days
            </span>
          )}
          {supportsVoice && (
            <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 text-xs bg-gray-50">
              Voice
            </span>
          )}
          {supportsSms && (
            <span className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 text-xs bg-gray-50">
              SMS
            </span>
          )}
        </div>
      )} */}

			{/* Auto-renew */}
			{onToggleRenew && (
				<div className="mt-4 flex items-center justify-between">
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-gray-700">
							Auto-renewals
						</span>
						<span className="text-xs text-gray-400">
							We’ll renew before expiry if turned on.
						</span>
					</div>

					{onToggleRenew ? (
						<div className="flex items-center gap-2">
							<span
								className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
									autoRenew
										? 'bg-emerald-50 text-emerald-700'
										: 'bg-gray-100 text-gray-600'
								}`}
							>
								{renewLabel}
							</span>
							<Switch
								isSelected={!!autoRenew}
								onValueChange={(v) => onToggleRenew(v)}
								size="sm"
								aria-label={`Auto renew ${planName}`}
							/>
						</div>
					) : (
						<span className="text-xs text-gray-400">—</span>
					)}
				</div>
			)}

			{/* Actions */}
			<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
				<Button
					onClick={onRecharge}
					disabled={!isActive}
					className="sm:col-span-1 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_8px_18px_rgba(79,70,229,0.25)] hover:brightness-105"
				>
					Recharge
				</Button>

				<Button
					onClick={onViewDetails}
					variant="outline"
					className="sm:col-span-1"
				>
					View details
				</Button>

				{onInstallShare && (
					<Button
						onClick={onInstallShare}
						variant="outline"
						className="sm:col-span-1"
					>
						Install / share
					</Button>
				)}
			</div>
		</article>
	);
};
