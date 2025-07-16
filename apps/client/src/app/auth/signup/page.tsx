import { Metadata } from 'next';
import SignupClient from './signup-client';

export function generateMetadata(): Metadata {
	return {
		title: 'Create new account',
	};
}

export default function SignupPage() {
	return <SignupClient />;
}
