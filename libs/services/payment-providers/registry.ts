import { PaymentProviderAdapter } from './types';
import { PaystackAdapter } from './paystack/paystack-adapter';

const adapters: Record<string, PaymentProviderAdapter> = {};

function register(adapter: PaymentProviderAdapter) {
	adapters[adapter.name] = adapter;
}

export function getPaymentProviderAdapter(
	provider: string
): PaymentProviderAdapter | undefined {
	return adapters[provider];
}

export function getOrThrowPaymentProviderAdapter(
	provider: string
): PaymentProviderAdapter {
	const adapter = getPaymentProviderAdapter(provider);
	if (!adapter) {
		throw new Error(`Payment provider '${provider}' is not registered`);
	}
	return adapter;
}

// Register built-in adapters
register(new PaystackAdapter());

// Future adapters (e.g., StripeAdapter, PaypalAdapter) can be registered here.

export const _adaptersRegistry = adapters; // exported for potential testing
