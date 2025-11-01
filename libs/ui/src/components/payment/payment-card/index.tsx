import React, { useEffect } from 'react';
import CreditCardIcon from '../../../assets/credit-card.svg';

import styles from './style.module.scss';
import { PaymentCardSelector } from './payment-card-selector';
import { useAppDispatch, useAppSelector } from '@travelpulse/state';
import { fetchCards } from '@travelpulse/state/thunks';
import { Button } from '../../common';
import { PaymentCardPayload } from '@travelpulse/interfaces';

type CardInterface = Pick<PaymentCardPayload, 'id' | 'last4'>;

interface PaymentCardProps {
	selected: boolean;
	selectedCard: CardInterface | null;
	onSelectedCard: React.Dispatch<React.SetStateAction<CardInterface | null>>;
}

export const PaymentCard = ({
	selected,
	selectedCard,
	onSelectedCard,
}: PaymentCardProps) => {
	const dispatch = useAppDispatch();
	let {
		list: cards,
		status,
		error,
	} = useAppSelector((state) => state.account.cards.items);

	const isLoading = status === 'loading';
	const [addNewCardSignal, setAddNewCardSignal] = React.useState(false);

	const isError = status === 'failed';
	const errorMessage =
		typeof error === 'string'
			? error
			: error?.message ?? 'Unable to load your saved cards.';

	useEffect(() => {
		if (status === 'idle') {
			void dispatch(fetchCards());
		}
	}, [dispatch, status]);

	useEffect(() => {
		if (!cards.length) {
			onSelectedCard(null);
			return;
		}

		const hasSelected = cards.some((card) => card.id === selectedCard?.id);
		if (!hasSelected) {
			const fallback =
				cards.find((card) => card.isDefault) ?? cards[0] ?? null;

			if (fallback && fallback.id !== selectedCard?.id) {
				onSelectedCard(fallback);
			}
		}
	}, [cards, selectedCard]);

	function showSelector() {
		setAddNewCardSignal(false);
	}

	function onNewCardSignal() {
		// Return to the initial screen; parent can open the Add Card modal
		setAddNewCardSignal(true);
	}

	const canShowSummary =
		(!isLoading && !isError && addNewCardSignal) ||
		(!isLoading && cards.length === 0 && !isError);

	return (
		<div className={styles.paymentCardContainer} data-selected={selected}>
			{canShowSummary && (
				<div className={styles.inner}>
					<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
						<div className="shrink-0">
							<CreditCardIcon />
						</div>

						<div className="flex-1 min-w-0">
							<div className={styles.cardType}>
								Credit / Debit Card
							</div>
							<div className={styles.cardTypeList}>
								Pay securely using your Mastercard, Visa, AMEX,
								Maestro, Discover, or American Express.
							</div>

							{/* Mobile button (full width) */}
							{cards.length > 0 && (
								<div className="mt-4 sm:hidden">
									<Button
										onClick={showSelector}
										className="w-full rounded-full"
									>
										Select card
									</Button>
								</div>
							)}
						</div>

						{/* Desktop button (right aligned) */}
						{cards.length > 0 && (
							<div className="hidden sm:block">
								<Button
									onClick={showSelector}
									className="rounded-full px-5"
								>
									Select card
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{!isError && (
				<div>
					<PaymentCardSelector
						isLoading={isLoading}
						cards={cards}
						showSummary={addNewCardSignal}
						onNewCardSignal={onNewCardSignal}
						onSelectedCard={onSelectedCard}
						selectedCard={selectedCard}
					/>
				</div>
			)}

			{isError ? (
				<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					<p className="font-medium">{errorMessage}</p>
					<Button
						variant="outline"
						size="sm"
						className="mt-3"
						onClick={() => {
							void dispatch(fetchCards());
						}}
					>
						Retry
					</Button>
				</div>
			) : null}
		</div>
	);
};
