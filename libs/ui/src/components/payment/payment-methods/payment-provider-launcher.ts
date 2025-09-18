import { PaymentAttemptResponse } from '@travelpulse/interfaces';
import { handlePaystack } from './paystack';
import { AppDispatch } from '@travelpulse/state';

export const launchPaymentProvider = (
	paymentAttempt: PaymentAttemptResponse,
	dispatch: AppDispatch
) => {
	const { provider } = paymentAttempt;

	switch (provider) {
		case 'paystack':
			return handlePaystack(paymentAttempt, dispatch);

		// Future cases for other providers can be added here.
		default:
			console.warn(`No launcher implemented for provider: ${provider}`);
			break;
	}
};
