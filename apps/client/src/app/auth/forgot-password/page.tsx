import { Metadata } from 'next';
import ForgotPasswordClient from './forgot-password-client';

export function generateMetadata(): Metadata {
	return {
		title: `Forgot password`,
	};
}

export default function ForgotPasswordPage() {
	return <ForgotPasswordClient />;
}
