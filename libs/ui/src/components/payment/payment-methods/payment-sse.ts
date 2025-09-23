export type PaymentConfirmedEvent = {
	orderId: number;
	paymentId: number;
	referenceId?: string;
};

let es: EventSource | null = null;
let listenersAttached = false;
const PAYMENT_CONFIRMED_EVENT = 'payment-confirmed';

function attachListeners(
	instance: EventSource,
	handler: (e: MessageEvent<any>) => void
) {
	if (listenersAttached) return null;

	instance.onopen = () => console.log('[SSE] connected');
	instance.onerror = (e) => console.warn('[SSE] error', e);

	instance.addEventListener(PAYMENT_CONFIRMED_EVENT, handler);
	listenersAttached = true;

	return instance;
}

export function ensurePaymentSSE(
	handler: (e: MessageEvent<any>) => void
): EventSource | null {
	if (typeof window === 'undefined') return null;

	if (es) {
		return attachListeners(es, handler);
	}

	es = new EventSource('http://localhost:4000/sse/payments', {
		withCredentials: true,
	} as any);

	return attachListeners(es, handler);
}

export function listenPaymentConfirmed(
	onEvent: (evt: PaymentConfirmedEvent) => void
) {
	const handler = (e: MessageEvent) => {
		try {
			const data = JSON.parse(e.data) as PaymentConfirmedEvent;
			console.log('[SSE] payment-confirmed event received:', data);

			onEvent(data);
		} catch {}
	};

	const src = ensurePaymentSSE(handler);

	if (!src) return () => {};

	return () => src.removeEventListener(PAYMENT_CONFIRMED_EVENT, handler);
}
