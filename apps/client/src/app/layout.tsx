import type { Metadata } from 'next';
import './globals.scss';
import { ConditionalFooter, ThemeProvider } from '@travelpulse/ui';
import ReduxProvider from '../providers/redux-provider';

export const metadata: Metadata = {
	title: {
		default: 'Stay connected wherever you travel | TravelPulse',
		template: '%s | TravelPulse',
	},
	description:
		'Global eSIM connectivity—international - Stay connected while traveling with our eSIM plans. Explore local and international data plans for seamless connectivity.',
	metadataBase: new URL('https://travelpulse.com'),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="light">
			<body className="antialiased">
				<ReduxProvider>
					<ThemeProvider>
						{children}

						<ConditionalFooter />
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
