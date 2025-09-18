import { PaymentAttemptResponse } from '@travelpulse/interfaces';
import {
	startPaymentConfirmationPolling,
	stopPaymentConfirmationPolling,
} from '../confirmation-watcher';
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

const launchPaystack = async (
	accessCode: string,
	dispatch: AppDispatch,
	data: Pick<PaymentAttemptResponse, 'paymentId' | 'orderId'>
) => {
	try {
		if (typeof window === 'undefined') return; // SSR guard
		// Dynamically import to avoid touching window during SSR
		const mod: any = await import('@paystack/inline-js');
		const Paystack = mod?.default ?? mod;
		const popup = new Paystack();

		popup.resumeTransaction(accessCode, {
			onLoad(tranx: unknown) {
				console.log('Paystack loaded:', tranx);
			},
			onSuccess: (response: PaystackSuccessResponse) => {
				console.log('Paystack success:', response);

				dispatch(updateConfirmationStep('processing'));

				startPaymentConfirmationPolling({
					orderId: data.orderId,
					paymentId: data.paymentId,
					referenceId: response.reference,
					onSuccess: () => {
						console.log('Payment confirmed via polling');
					},
					onTimeout: () => {
						console.warn('Payment confirmation timed out');
					},
				});
			},
			onCancel: () => {
				console.log('User canceled. Paystack popup closed');
				stopPaymentConfirmationPolling(data.orderId, data.paymentId);
			},
			onError: (error: unknown) => {
				console.error('Paystack error:', error);
				// TODO: surface error to modal state
				stopPaymentConfirmationPolling(data.orderId, data.paymentId);
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
			void launchPaystack(metadata.accessCode, dispatch, {
				paymentId: paymentAttempt.paymentId,
				orderId: paymentAttempt.orderId,
			});
		} else if (redirectUrl) {
			window.location.href = redirectUrl;
		}
	}
};
