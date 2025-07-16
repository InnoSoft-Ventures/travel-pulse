import { Metadata } from 'next';
import LoginClient from './signin-client';

export function generateMetadata(): Metadata {
	return {
		title: 'Sign In',
	};
}

export default function LoginPage() {
	return <LoginClient />;
}
