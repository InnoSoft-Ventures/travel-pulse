import { AppSidebar, AppTopBar } from '@travelpulse/ui';
import '../globals.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: {
		default: 'Stay connected wherever you travel | TravelPulse',
		template: '%s | TravelPulse',
	},
	description: 'Manage your travel plans and eSIM connectivity.',
	metadataBase: new URL('https://travelpulse.com'),
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-gray-50 text-gray-900">
			<AppSidebar />
			<div className="flex flex-col flex-1 overflow-hidden">
				<AppTopBar />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
