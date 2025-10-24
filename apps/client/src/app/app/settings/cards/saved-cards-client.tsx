'use client';
import * as React from 'react';

import { PaymentCard, PaymentCardCreation } from '@travelpulse/interfaces';
import { AddCard, SavedCard, Title } from '@travelpulse/ui';
import styles from './styles.module.scss';

// ---------- Paystack stub ----------
/**
 * This file stubs a Paystack tokenization flow. Wire it like so when ready:
 *
 * import PaystackPop from '@paystack/inline-js';
 * const paystack = new PaystackPop();
 * paystack.newTransaction({
 *   key: PAYSTACK_PUBLIC_KEY,
 *   email: user.email,
 *   amount: 100, // minimal auth, or 0 for tokenization where supported
 *   onSuccess: (res) => onTokenReceived(res.reference, res),
 *   onCancel: () => setLoading(false),
 * });
 */

// ---------- Component ----------
export default function SavedCardsSection() {
	const [cards, setCards] = React.useState<PaymentCard[]>([
		{
			id: 1,
			brand: 'mastercard',
			last4: '4748',
			expMonth: 12,
			expYear: new Date().getFullYear() + 0,
			cardName: 'ST V',
			isDefault: true,
			createdAt: new Date().toISOString(),
		},
		{
			id: 2,
			brand: 'visa',
			last4: '0099',
			expMonth: 11,
			expYear: new Date().getFullYear() + 1,
			cardName: 'Personal',
			isDefault: false,
		},
		{
			id: 3,
			brand: 'amex',
			last4: '1005',
			expMonth: new Date().getMonth() + 1,
			expYear: new Date().getFullYear(),
			cardName: 'Biz Travel',
			isDefault: false,
		},
	]);

	function removeCard(id: number) {
		setCards((prev) => prev.filter((c) => c.id !== id));
	}

	function addCard(newCard: PaymentCardCreation) {
		setCards((prev) => [
			...prev,
			{
				...newCard,
				id: prev.length + 1,
				brand: 'unknown',
				last4: '0000',
				isDefault: false,
				createdAt: new Date().toISOString(),
			},
		]);
	}

	function makeDefault(id: number) {
		setCards((prev) =>
			prev.map((c) => ({
				...c,
				isDefault: c.id === id,
			}))
		);
	}

	return (
		<div className={styles.container}>
			{/* Header */}
			<div className="flex items-center justify-between gap-4 mb-6">
				<div>
					<Title size="size19" className={styles.title}>
						Cards
					</Title>

					<Title color="tertiary" size={'size14'}>
						Manage your stored payment methods. Choose a default, or
						add a new card.
					</Title>
				</div>

				<AddCard
					onAddCard={(c) => {
						addCard(c);
					}}
				/>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
				{cards.map((card) => (
					<SavedCard
						key={card.id}
						card={card}
						makeDefault={makeDefault}
						removeCard={removeCard}
					/>
				))}
			</div>

			{/* Usage Drawer */}
		</div>
	);
}
