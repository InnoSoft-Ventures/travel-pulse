import { PaymentAttemptResponse } from '@travelpulse/interfaces';
import { AppDispatch, updateConfirmationStep } from '@travelpulse/state';

interface PaystackSuccessResponse {
	reference: string;
	trans: string;
	status: string;
	message: string;
	transaction: string;
	trxref: string;
	redirecturl: string;
}

const launchPaystack = async (accessCode: string, dispatch: AppDispatch) => {
	try {
		if (typeof window === 'undefined') return; // SSR guard
		// Dynamically import to avoid touching window during SSR
		const mod: any = await import('@paystack/inline-js');
		const Paystack = mod?.default ?? mod;
		const popup = new Paystack();

		popup.resumeTransaction(accessCode, {
			onLoad(tranx: unknown) {
				console.log('Paystack loaded:', tranx);
				dispatch(updateConfirmationStep('processing'));
			},
			onSuccess: (response: PaystackSuccessResponse) => {
				console.log('Paystack success:', response);
			},
			onCancel: () => {
				console.log('User canceled. Paystack popup closed');
				dispatch(updateConfirmationStep('failed'));
			},
			onError: (error: unknown) => {
				console.error('Paystack error:', error);
				// TODO: surface error to modal state
				dispatch(updateConfirmationStep('failed'));
			},
		});
	} catch (err) {
		console.error('Failed to launch Paystack:', err);
	}
};

export const handlePaystack = (
	paymentAttempt: PaymentAttemptResponse,
	dispatch: AppDispatch
) => {
	const { session } = paymentAttempt;

	if (session) {
		const { metadata, redirectUrl } = session;

		if (metadata) {
			void launchPaystack(metadata.accessCode, dispatch);
		} else if (redirectUrl) {
			window.location.href = redirectUrl;
		}
	}
};
