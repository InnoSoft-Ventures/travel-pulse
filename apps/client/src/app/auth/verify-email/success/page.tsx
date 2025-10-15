import { Metadata } from 'next';
import VerifyEmailSuccessClient from './verify-email-success-client';

export const metadata: Metadata = {
	title: 'Account verified',
	description: 'Your TravelPulse account is now active. Sign in to continue.',
};

export default function VerifyEmailSuccessPage() {
	return <VerifyEmailSuccessClient />;
}
