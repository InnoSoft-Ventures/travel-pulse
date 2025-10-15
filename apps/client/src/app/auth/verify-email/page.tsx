import { Metadata } from 'next';
import VerifyEmailClient from './verify-email-client';

export const metadata: Metadata = {
	title: 'Verify your email',
	description: 'Check your inbox to activate your TravelPulse account.',
};

export default function VerifyEmailPage() {
	return <VerifyEmailClient />;
}
