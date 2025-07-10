import { addToast, ToastProvider } from '@heroui/toast';

type ToastType =
	| 'success'
	| 'default'
	| 'foreground'
	| 'primary'
	| 'secondary'
	| 'warning'
	| 'danger';

export type ToastPlacement =
	| 'bottom-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'top-right'
	| 'top-left'
	| 'top-center';

export interface Toast {
	title: string;
	description?: string;
	endContent?: React.ReactNode;
}

interface ToastOptions extends Toast {
	type?: ToastType;
	promise?: Promise<any>;
	variant?: 'flat' | 'solid' | 'bordered';
}

export function getResponsivePlacement(): ToastPlacement {
	if (typeof window !== 'undefined') {
		return window.innerWidth < 768 ? 'bottom-center' : 'bottom-right';
	}
	return 'top-center';
}

class ToastManager {
	private static instance: ToastManager;

	private constructor() {}

	static getInstance() {
		if (!ToastManager.instance) {
			ToastManager.instance = new ToastManager();
		}
		return ToastManager.instance;
	}

	show(options: ToastOptions) {
		const {
			type = 'default',
			title,
			description,
			promise,
			endContent,
			variant = 'flat',
		} = options;

		addToast({
			title,
			description,
			promise,
			endContent,
			variant,
			color: type,
			classNames: {
				description: 'whitespace-pre-line',
			},
		});
	}

	success(options: Toast) {
		this.show({
			...options,
			type: 'success',
		});
	}

	error(options: Toast) {
		this.show({
			...options,
			type: 'danger',
		});
	}

	info(options: Toast) {
		this.show({
			...options,
			type: 'default',
		});
	}

	warning(options: Toast) {
		this.show({
			...options,
			type: 'warning',
		});
	}
}

const toast = ToastManager.getInstance();

export { ToastProvider, toast };
