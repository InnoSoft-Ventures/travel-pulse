import { confirmPayment } from '@travelpulse/state/thunks';
import { storeRef } from '@travelpulse/state';

const POLL_INTERVAL_MS = 4000; // base interval
const MAX_POLL_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const JITTER_MS = 400; // add small randomness to avoid thundering herd

interface StartPollingArgs {
	orderId: number;
	paymentId: number;
	referenceId: string;
	onSuccess?: () => void;
	onTimeout?: () => void;
	onPermanentFailure?: () => void;
	dispatch?: any; // optional custom dispatch
}

interface PollController {
	stop: () => void;
	isActive: () => boolean;
}

const activeControllers: Record<string, { stopped: boolean }> = {};

export const startPaymentConfirmationPolling = (
	args: StartPollingArgs
): PollController => {
	const { orderId, paymentId, referenceId } = args;
	const key = `${orderId}-${paymentId}`;
	if (activeControllers[key]) {
		return {
			stop: () => {
				activeControllers[key].stopped = true;
			},
			isActive: () => !activeControllers[key].stopped,
		};
	}
	activeControllers[key] = { stopped: false };

	const runtimeStore = storeRef.get();
	const dispatch = args.dispatch || runtimeStore?.dispatch;
	if (!dispatch) {
		console.warn(
			'No store available yet for payment confirmation polling.'
		);
		return {
			stop: () => {},
			isActive: () => false,
		};
	}
	const startTime = Date.now();

	const poll = async () => {
		const controller = activeControllers[key];
		if (!controller || controller.stopped) return;

		const elapsed = Date.now() - startTime;
		if (elapsed > MAX_POLL_DURATION_MS) {
			controller.stopped = true;
			args.onTimeout?.();
			return;
		}

		try {
			const resultAction = await dispatch(
				confirmPayment({ orderId, paymentId, referenceId })
			);

			if (confirmPayment.fulfilled.match(resultAction)) {
				controller.stopped = true;
				args.onSuccess?.();
				return;
			}
			// If rejected, continue polling unless timeout; could add backoff
		} catch (e) {
			// swallow and continue
		}

		const jitter = Math.floor(Math.random() * JITTER_MS);
		setTimeout(poll, POLL_INTERVAL_MS + jitter);
	};

	poll();

	return {
		stop: () => {
			if (activeControllers[key]) activeControllers[key].stopped = true;
		},
		isActive: () =>
			!!activeControllers[key] && !activeControllers[key].stopped,
	};
};

export const stopPaymentConfirmationPolling = (
	orderId: number,
	paymentId: number
) => {
	const key = `${orderId}-${paymentId}`;
	if (activeControllers[key]) activeControllers[key].stopped = true;
};
