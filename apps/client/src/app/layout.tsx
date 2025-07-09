import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.scss';
import { Footer, ThemeProvider } from '@travelpulse/ui';
import ReduxProvider from '../providers/redux-provider';

const geistSans = localFont({
	src: '../public/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: '../public/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'TravelPulse',
	description:
		'TravelPulse eSIM Solutions - Stay connected while traveling with our eSIM plans. Explore local and international data plans for seamless connectivity.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="light">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReduxProvider>
					<ThemeProvider>
						{children}

						<Footer />
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
