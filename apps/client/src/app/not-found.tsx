'use client';

import { TopNav, useTheme } from '@travelpulse/ui';
import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
	const { setTheme } = useTheme();

	useEffect(() => {
		setTheme({ footer: 'light' });
		return () => setTheme({ footer: 'dark' });
	}, [setTheme]);

	return (
		<>
			<TopNav />
			<div className="relative top-[-2.5rem] min-h-[85vh] mb-[-90px] bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">
				{/* Large animated decorative circles */}
				<div className="absolute top-[-6rem] left-[-6rem] w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400 via-pink-400 to-transparent rounded-full opacity-30 blur-3xl animate-float-slow" />
				<div className="absolute bottom-[-6rem] right-[-6rem] w-[28rem] h-[28rem] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-cyan-300 to-transparent rounded-full opacity-30 blur-3xl animate-float-slower" />

				{/* Medium decorative floating circles */}
				<div className="absolute top-[42%] left-[55%] w-16 h-16 bg-purple-500 rounded-full opacity-40 blur-xl animate-float-diag z-0" />
				<div className="absolute top-[58%] left-[33%] w-12 h-12 bg-blue-400 rounded-full opacity-30 blur-xl animate-float-diag-reverse z-0" />

				<h1 className="text-6xl font-extrabold mb-4 tracking-tight z-10">
					404
				</h1>
				<h2 className="text-2xl sm:text-3xl font-semibold mb-3 z-10">
					Page Not Found
				</h2>
				<p className="text-base sm:text-lg text-gray-300 max-w-xl z-10">
					The page you're looking for doesn’t exist or may have been
					moved. Try going back to the homepage or explore our
					available eSIM plans.
				</p>

				<div className="mt-6 flex flex-col sm:flex-row gap-4 z-10">
					<Link
						href="/"
						className="px-6 py-3 bg-white text-black font-semibold rounded-md shadow-md hover:shadow-xl transition duration-300 border border-transparent"
					>
						Go to Homepage
					</Link>

					<div className="p-[2px] rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-purple-600">
						<Link
							href="/plans"
							className="block px-6 py-3 bg-[#302b63] text-white font-semibold rounded-md hover:bg-[#373a6c] transition duration-300"
						>
							View eSIM Plans
						</Link>
					</div>
				</div>

				<style jsx>{`
					@keyframes float-slow {
						0%,
						100% {
							transform: translateY(0px);
						}
						50% {
							transform: translateY(-12px);
						}
					}
					@keyframes float-slower {
						0%,
						100% {
							transform: translateY(0px);
						}
						50% {
							transform: translateY(16px);
						}
					}
					@keyframes float-diag {
						0%,
						100% {
							transform: translate(0, 0);
						}
						50% {
							transform: translate(24px, -24px);
						}
					}
					@keyframes float-diag-reverse {
						0%,
						100% {
							transform: translate(0, 0);
						}
						50% {
							transform: translate(-24px, 24px);
						}
					}
					.animate-float-slow {
						animation: float-slow 10s ease-in-out infinite;
					}
					.animate-float-slower {
						animation: float-slower 14s ease-in-out infinite;
					}
					.animate-float-diag {
						animation: float-diag 12s ease-in-out infinite;
					}
					.animate-float-diag-reverse {
						animation: float-diag-reverse 16s ease-in-out infinite;
					}
				`}</style>
			</div>
		</>
	);
}
