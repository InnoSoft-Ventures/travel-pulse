import React from 'react';
import { Home, Smartphone, Bell, Settings, HelpCircle } from 'lucide-react';
import styles from './style.module.scss';
import { NavLink } from '../../common';
import { Logo } from '../../common/logo';

export function AppSidebar() {
	return (
		<aside className={styles.aside}>
			<h2 className="text-xl font-bold mb-10">
				<Logo variant="secondary" color="dark" hideSlogan />
			</h2>
			<nav className={styles.nav}>
				<NavLink href="/app">
					<Home size={18} /> Overview
				</NavLink>
				<NavLink href="/app/esims">
					<Smartphone size={18} /> eSIM Management
				</NavLink>
				<NavLink href="/app/notifications">
					<Bell size={18} /> Notifications
				</NavLink>
				<NavLink href="/app/account">
					<Settings size={18} /> Settings
				</NavLink>
				<NavLink href="/app/support">
					<HelpCircle size={18} /> Help & Support
				</NavLink>
			</nav>
		</aside>
	);
}
