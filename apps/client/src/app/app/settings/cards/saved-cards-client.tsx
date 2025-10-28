'use client';
import * as React from 'react';

import { PaymentCardCreation } from '@travelpulse/interfaces';
import { AddCard, SavedCard, Title } from '@travelpulse/ui';
import styles from './styles.module.scss';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { fetchCards } from '@travelpulse/ui/thunks';

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
	const dispatch = useAppDispatch();

	const { status, list: cards } = useAppSelector(
		(state) => state.account.cards.items
	);

	React.useEffect(() => {
		dispatch(fetchCards());
	}, [dispatch]);

	function addCard(newCard: PaymentCardCreation) {
		// setCards((prev) => [
		// 	...prev,
		// 	{
		// 		...newCard,
		// 		id: prev.length + 1,
		// 		brand: 'unknown',
		// 		last4: '0000',
		// 		isDefault: false,
		// 		createdAt: new Date().toISOString(),
		// 	},
		// ]);
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
				{cards.map((card, index) => (
					<SavedCard key={card.id} index={index} card={card} />
				))}
			</div>

			{/* Usage Drawer */}
		</div>
	);
}
