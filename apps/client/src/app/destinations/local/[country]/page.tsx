import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'eSIM Plans - TravelPulse',
		description:
			'Discover eSIM plans for your destination. Stay connected with our local data plans.',
	};
}

const CountryPage = () => {
	// Example of how you might get country/state data within the component
	const getCountryStateData = () => {
		// This could be from props, context, or any other source
		// For example:
		// - From a parent component
		// - From a global state management solution
		// - From a context provider
		return {
			name: 'France', // This would come from your actual data source
			description: 'Explore France with our eSIM plans',
			// Add other country/state specific data
		};
	};

	const countryData = getCountryStateData();

	if (!countryData) {
		notFound();
	}

	return (
		<div>
			<h1>{countryData.name} eSIM Plans</h1>
			<p>{countryData.description}</p>
			{/* Add your country-specific content */}
		</div>
	);
};

export default CountryPage;
