import { PaymentMethod, PaymentProvider } from './payment-card';
import { PaymentStatus } from './enums';

export type PaymentAttemptResponse = {
	paymentId: number;
	orderId: number;
	method: PaymentMethod;
	provider: PaymentProvider;
	status: PaymentStatus;
	amount: number;
	currency: string;
	// Generic provider session/popup bootstrap data (e.g., Paystack reference)
	session?: {
		providerReference?: string; // e.g., Paystack reference
		redirectUrl?: string; // if a provider needs redirection
		metadata?: Record<string, any>;
	};
};
