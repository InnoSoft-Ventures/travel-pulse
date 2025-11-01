import React from 'react';
import { dateJs } from '@travelpulse/utils';
import { classNames } from '../../utils';
import { PaymentCardPayload } from '@travelpulse/interfaces';

// Lightweight brand pill (kept local to avoid external assets)
export const BrandPill: React.FC<{ brand: PaymentCardPayload['brand'] }> = ({
	brand,
}) => {
	const map: Record<
		PaymentCardPayload['brand'],
		{ label: string; bg: string }
	> = {
		visa: { label: 'VISA', bg: 'bg-blue-600' },
		mastercard: { label: 'MC', bg: 'bg-red-600' },
		amex: { label: 'AMEX', bg: 'bg-emerald-600' },
		verve: { label: 'VERVE', bg: 'bg-orange-600' },
		unknown: { label: 'CARD', bg: 'bg-gray-600' },
	};
	const b = map[brand];

	return (
		<span
			className={classNames(
				'inline-flex items-center justify-center text-[10px] font-bold text-white rounded px-1.5 py-0.5',
				b.bg
			)}
		>
			{b.label}
		</span>
	);
};

export function expiryLabel(m: number, y: number) {
	const mm = String(m).padStart(2, '0');
	return `${mm} / ${String(y).slice(-2)}`;
}

export function isExpiringSoon(m: number, y: number): boolean {
	const now = dateJs();
	const lastOfMonth = dateJs(new Date(y, m, 0));

	return lastOfMonth.diff(now, 'day') <= 60;
}

export const brandLabel = (brand: PaymentCardPayload['brand']) => {
	const map = {
		visa: 'Visa',
		mastercard: 'MasterCard',
		amex: 'American Express',
		verve: 'Verve',
		unknown: 'Card',
	};

	return map[brand] || 'Card';
};
