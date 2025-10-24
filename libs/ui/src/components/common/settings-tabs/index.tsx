'use client';

import React from 'react';
import { User, Lock, CreditCard, Package } from 'lucide-react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';

const tabs = [
	{ key: 'account', label: 'Account', icon: User },
	{ key: 'security', label: 'Security', icon: Lock },
	// { key: 'appearance', label: 'Appearance', icon: Moon },
	{ key: 'orders', label: 'Orders', icon: Package },
	{ key: 'billing', label: 'Billing', icon: CreditCard },
	// { key: 'device', label: 'Device', icon: TabletSmartphone },
];

export function SettingsTabs() {
	const pathname = usePathname();
	const current = pathname.split('/').pop();

	const router = useRouter();

	const onTabChange = (tab: string) => {
		router.push(tab);
	};

	return (
		<div className="h-auto rounded-md p-1 max-w-[860px] bg-[#f0f0f2] items-center justify-center text-muted-foreground">
			<div
				className={`grid grid-cols-${tabs.length} items-center justify-center gap-[9.5px] px-[0.5px] py-[0.5px]`}
			>
				{tabs.map(({ key, label, icon: Icon }) => {
					const isActive = current === key || pathname.includes(key);

					return (
						<button
							key={key}
							onClick={() => onTabChange(key)}
							data-state={isActive ? 'active' : 'inactive'}
							className={clsx(
								'flex flex-row px-3 justify-center items-center data-[state=active]:shadow-sm gap-[6px] py-[8px] rounded-sm whitespace-nowrap transition-all duration-150',
								isActive
									? 'bg-white text-[--dark-purple]'
									: 'text-[rgb(100, 116, 139)]'
							)}
						>
							<Icon
								size={20}
								strokeWidth={1.5}
								className={clsx('transition-colors', {
									'text-[var(--dark-purple)]': isActive,
									'text-[rgb(100, 116, 139)]': !isActive,
								})}
							/>
							<span className="font-medium text-sm">{label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
