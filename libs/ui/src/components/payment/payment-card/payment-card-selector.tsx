import React from 'react';
import { Badge, Button, Radio, RadioGroup, Title } from '../../common';
import { cn } from '../../../utils';
import { brandLabel, BrandPill } from '../../saved-card/saved-card.util';
import { PaymentCardPayload } from '@travelpulse/interfaces';

type CardInterface = Pick<PaymentCardPayload, 'id' | 'last4'>;

interface PaymentCardSelectorProps {
	cards: PaymentCardPayload[];
	onNewCardSignal: () => void;
	isLoading: boolean;
	showSummary: boolean;
	selectedCard: CardInterface | null;
	onSelectedCard: React.Dispatch<React.SetStateAction<CardInterface | null>>;
}

export const PaymentCardSelector = ({
	cards,
	isLoading,
	onNewCardSignal,
	showSummary,
	selectedCard,
	onSelectedCard,
}: PaymentCardSelectorProps) => {
	const showSkeleton = isLoading && cards.length === 0;

	return (
		<>
			{showSkeleton ? (
				<CardsSkeleton />
			) : (
				<>
					{cards.length > 0 && !showSummary && (
						<div className="space-y-5">
							{/* Header */}
							<div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
								<div>
									<div className="flex items-start justify-between sm:justify-start">
										<Title size="size16">
											Pay with a saved card
										</Title>

										{/* Mobile CTA */}
										<div className="sm:hidden">
											<Button
												onClick={onNewCardSignal}
												className="gap-2 rounded-full"
											>
												+ Add New Card
											</Button>
										</div>
									</div>

									{/* Helper line – lighter & shorter */}
									<p className="mt-2 max-w-[62ch] text-sm text-slate-600">
										Choose your preferred card to complete
										payment.
									</p>
								</div>

								{/* Desktop CTA */}
								<div className="hidden sm:block">
									<Button
										onClick={onNewCardSignal}
										className="gap-2 rounded-full"
									>
										+ Add New Card
									</Button>
								</div>
							</div>

							{/* Cards list */}
							<div className="p-4">
								<RadioGroup
									aria-labelledby="saved-card-title"
									name="payment-card"
									value={
										selectedCard
											? String(selectedCard.id)
											: undefined
									}
									onValueChange={(value) =>
										onSelectedCard(
											cards.find(
												(card) =>
													card.id === Number(value)
											) || null
										)
									}
									className={cn(
										cards.length >= 3
											? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
											: 'flex flex-col gap-4'
									)}
								>
									{cards.map((card) => {
										const value = String(card.id);
										const selected =
											selectedCard?.id === card.id;
										const expiry = `${String(
											card.expMonth
										).padStart(2, '0')}/${String(
											card.expYear
										).slice(-4)}`;

										return (
											<div key={card.id}>
												<div
													className={cn(
														'rounded-xl border px-4 py-4 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-300',
														selected
															? 'border-indigo-300 bg-indigo-50'
															: 'border-transparent bg-slate-50/60 hover:border-slate-200'
													)}
													role="radio"
													aria-checked={selected}
													tabIndex={0}
												>
													<div className="grid grid-cols-[auto_1fr] items-center gap-4">
														<Radio
															id={`card-${card.id}`}
															value={value}
															tabIndex={-1}
															classNames={{
																hiddenInput:
																	'focus-within:outline-none',
															}}
														/>
														<label
															htmlFor={`card-${card.id}`}
															className="cursor-pointer"
														>
															<div className="space-y-1">
																<div className="text-base font-semibold">
																	{card.cardName ||
																		brandLabel(
																			card.brand
																		)}
																</div>
																<div className="text-sm text-slate-600">
																	{brandLabel(
																		card.brand
																	)}{' '}
																	••••
																	{
																		card.last4
																	}{' '}
																	• Expires{' '}
																	{expiry}
																</div>
																<div className="mt-2 flex items-center gap-2">
																	{card.isDefault && (
																		<Badge variant="success">
																			Default
																		</Badge>
																	)}
																	<BrandPill
																		brand={
																			card.brand
																		}
																	/>
																</div>
															</div>
														</label>
													</div>
												</div>
											</div>
										);
									})}
								</RadioGroup>
							</div>
							<p className="mt-2 text-xs text-slate-500">
								All transactions are secured with SSL and
								PCI-DSS compliance.
							</p>
						</div>
					)}
				</>
			)}
		</>
	);
};

const skeletonItems = Array.from({ length: 2 });

const CardsSkeleton: React.FC = () => (
	<div className="flex flex-col gap-4 p-4">
		{skeletonItems.map((_, idx) => (
			<div
				key={idx}
				className="flex animate-pulse items-start gap-4 rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-5"
			>
				<span className="h-5 w-5 rounded-full bg-slate-300" />
				<div className="flex-1 space-y-3">
					<div className="h-4 w-1/2 rounded bg-slate-300" />
					<div className="h-3 w-1/3 rounded bg-slate-200" />
					<div className="h-3 w-2/5 rounded bg-slate-200" />
					<div className="flex items-center gap-2">
						<span className="h-5 w-12 rounded bg-slate-200" />
						<span className="h-5 w-8 rounded bg-slate-300" />
					</div>
				</div>
			</div>
		))}
	</div>
);
