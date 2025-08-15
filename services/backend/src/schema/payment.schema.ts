import { z } from 'zod';
import { PAYMENT_METHODS, PaymentProvider } from '@travelpulse/interfaces';
import { isValidPaymentMethod } from '../utils/data';

const providerEnum = z.enum(
	Object.keys(PAYMENT_METHODS) as [PaymentProvider, ...PaymentProvider[]]
);

// method depends on provider at runtime; we validate with a refinement
export const PaymentAttemptSchema = z
	.object({
		currency: z.string(),
		provider: providerEnum,
		method: z.string(),
	})
	.refine(
		(val) => {
			return isValidPaymentMethod(val.provider, val.method);
		},
		{
			message: 'Invalid payment method for provider',
			path: ['method'],
		}
	);

export type PaymentAttemptRequest = z.infer<typeof PaymentAttemptSchema>;
