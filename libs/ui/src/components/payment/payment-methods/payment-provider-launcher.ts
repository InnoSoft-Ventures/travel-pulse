import { PaymentAttemptResponse } from '@travelpulse/interfaces';
import { handlePaystack } from './paystack';
// Removed AppDispatch import to avoid runtime state import

export const launchPaymentProvider = (
	paymentAttempt: PaymentAttemptResponse,
	dispatch: any
) => {
	const { provider } = paymentAttempt;

	switch (provider) {
		case 'paystack':
			return handlePaystack(paymentAttempt, dispatch);

		// TODO: Future cases for other providers can be added here.
		default:
			console.warn(`No launcher implemented for provider: ${provider}`);
			break;
	}
};
