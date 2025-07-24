'use client';
import React from 'react';
import { Button } from '../../common';
import styles from './style.module.scss';

import WifiIcon from '../../../assets/wifi.svg';
import PhoneIcon from '../../../assets/phone.svg';
import { SimCardProps } from '../sim-interface';

export const SimCard: React.FC<SimCardProps> = ({
	data,
	onRecharge,
	onViewDetails,
}) => {
	const {
		providerName,
		planName,
		phoneNumber,
		dataLeft,
		expiresOn,
		isActive,
	} = data;

	const containerClass = isActive ? '' : 'opacity-50 pointer-events-none';
	const statusClasses = isActive
		? 'bg-green-100 text-green-600 border border-green-400'
		: 'bg-gray-200 text-gray-500 border border-gray-300';

	return (
		<div
			className={`bg-white rounded-lg shadow-sm p-6 relative max-w-md ${containerClass}`}
		>
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-semibold">{planName}</h3>
					<p className="text-gray-500">{providerName}</p>
				</div>
				<div
					className={`flex items-center px-3 py-1 rounded-full ${statusClasses}`}
				>
					<WifiIcon
						fill="none"
						stroke="currentColor"
						data-active={isActive}
						className={styles.wifiIcon}
					/>
					<span className="text-sm">
						{isActive ? 'Active' : 'Inactive'}
					</span>
				</div>
			</div>

			{/* Phone */}
			<div className="flex items-center mt-4 text-gray-900">
				<PhoneIcon
					stroke="currentColor"
					className="text-indigo-600 mr-2"
				/>
				<span>{phoneNumber}</span>
			</div>

			{/* Data & Expiry */}
			<div className="mt-6 grid grid-cols-2 gap-x-4 text-gray-700">
				<div>
					<p className="text-sm">Data left</p>
					<p className="font-medium">{dataLeft}</p>
				</div>
				<div>
					<p className="text-sm">Expires on</p>
					<p className="font-medium">{expiresOn}</p>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-4 flex space-x-3">
				{/* <button
					onClick={onRecharge}
					disabled={!isActive}
					className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
				></button> */}
				<Button onClick={onRecharge} fullWidth disabled={!isActive}>
					Recharge
				</Button>
				<Button
					onClick={onViewDetails}
					variant="link"
					fullWidth
					disabled={!isActive}
				>
					View Details
				</Button>
			</div>
		</div>
	);
};
