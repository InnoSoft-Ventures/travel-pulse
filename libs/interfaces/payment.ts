import { PaymentMethod, PaymentProvider } from './constants';
import { PaymentStatus } from './enums';

export type PaymentAttemptResponse = {
	paymentId: number;
	orderId: number;
	method: PaymentMethod;
	provider: PaymentProvider;
	status: PaymentStatus;
	amount: number;
	currency: string;
};
