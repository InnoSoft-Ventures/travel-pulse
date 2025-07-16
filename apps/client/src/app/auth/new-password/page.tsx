import { Metadata } from 'next';
import NewPasswordClient from './new-password-client';

export function generateMetadata(): Metadata {
	return {
		title: `Reset new password`,
	};
}

export default function NewPasswordPage() {
	return <NewPasswordClient />;
}
