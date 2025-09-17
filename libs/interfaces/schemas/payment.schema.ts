import { z } from 'zod';
import { isValidPaymentMethod } from '../utils/data';
import { PAYMENT_METHODS, PaymentMethod, PaymentProvider } from '../constants';

const providerEnum = z.enum(
	Object.keys(PAYMENT_METHODS) as [PaymentProvider, ...PaymentProvider[]]
);
// Collect all unique methods across providers and type them
const methodValues = Array.from(
	new Set(Object.values(PAYMENT_METHODS).flat())
) as [PaymentMethod, ...PaymentMethod[]];
const methodEnum = z.enum(methodValues);

// method depends on provider at runtime; we validate with a refinement
export const PaymentAttemptSchema = z
	.object({
		currency: z.string(),
		provider: providerEnum,
		method: methodEnum,
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

export const PaymentConfirmationRequestSchema = z.object({
	referenceId: z
		.string({
			required_error: 'Reference ID is required',
			invalid_type_error: 'Reference ID must be a string',
		})
		.min(1, {
			message: 'Reference ID must be at least 1 character long',
		})
		.max(100, {
			message: 'Reference ID must be at most 100 characters long',
		}),
});

export type PaymentAttemptRequest = z.infer<typeof PaymentAttemptSchema>;
export type PaymentConfirmationRequest = z.infer<
	typeof PaymentConfirmationRequestSchema
>;
