import { PAYMENT_METHODS, PaymentProvider } from '../payment-card';

/**
 * Checks if a given payment method is valid for the specified payment provider.
 *
 * @template P - The type of the payment provider, extending PaymentProvider.
 * @param provider - The payment provider to validate against.
 * @param method - The payment method to check for validity.
 * @returns {boolean} Returns `true` if the payment method is valid for the provider, otherwise `false`.
 *
 * @example
 * ```typescript
 * const isValid = isValidPaymentMethod('paypal', 'credit_card');
 * ```
 */
export function isValidPaymentMethod<P extends PaymentProvider>(
	provider: P,
	method: string
): boolean {
	return (PAYMENT_METHODS[provider] as readonly string[]).includes(
		method as any
	);
}
