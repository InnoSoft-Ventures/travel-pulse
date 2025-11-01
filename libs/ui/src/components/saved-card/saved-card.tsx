'use client';
import React from 'react';
import { Trash2, Star, MoreHorizontal, Clock } from 'lucide-react';

import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Title,
} from '../common';
import { ErrorHandler, PaymentCardPayload } from '@travelpulse/interfaces';
import { formatApiErrorDescription, toast } from '@travelpulse/utils';
import styles from './styles.module.scss';
import {
	markDefaultCard,
	removeCard,
	useAppDispatch,
} from '@travelpulse/state';
import {
	markDefaultCardThunk,
	removeCardThunk,
} from '@travelpulse/state/thunks';
import { LoaderIcon } from '../common/icon';
import { BrandPill, expiryLabel, isExpiringSoon } from './saved-card.util';

interface SavedCardProps {
	card: PaymentCardPayload;
	index: number;
}

export function SavedCard({ card, index }: SavedCardProps) {
	const dispatch = useAppDispatch();
	const [deleting, setDeleting] = React.useState(false);

	async function removeCardFn() {
		setDeleting(true);

		try {
			const results = await dispatch(removeCardThunk(card.id)).unwrap();

			if (results) {
				toast.success({
					title: 'Card Removed',
					description: 'The card has been removed successfully.',
				});

				dispatch(removeCard(index));
			}
		} catch (error) {
			console.error('Failed to remove card:', error);

			toast.error({
				title: 'Card Removal Failed',
				description: formatApiErrorDescription(error as ErrorHandler),
			});
		} finally {
			setDeleting(false);
		}
	}

	// Mark as default card
	async function markDefaultCardFn() {
		try {
			const results = await dispatch(
				markDefaultCardThunk(card.id)
			).unwrap();

			if (results) {
				toast.success({
					title: 'Card Marked as Default',
					description:
						'The card has been marked as default successfully.',
				});

				dispatch(markDefaultCard(index));
			}
		} catch (error) {
			console.error('Failed to mark card as default:', error);

			toast.error({
				title: 'Card Marking Failed',
				description: formatApiErrorDescription(error as ErrorHandler),
			});
		}
	}

	return (
		<Card
			key={card.id}
			className="relative flex h-full flex-col overflow-hidden"
		>
			<CardHeader className="space-y-3 pb-0">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-2">
						<Title size={'size14'} margin="none">
							{card.cardName || '—'}
						</Title>
					</div>
					<div className="flex items-center gap-2">
						{card.isDefault ? (
							<Badge variant="success" className="gap-1">
								<Star
									fill="white"
									stroke="none"
									className="h-3 w-3"
								/>
								Default
							</Badge>
						) : null}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									aria-label="Card actions"
								>
									<MoreHorizontal className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="min-w-48"
							>
								<DropdownMenuLabel>
									Quick actions
								</DropdownMenuLabel>
								{!card.isDefault && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={markDefaultCardFn}
											className="gap-2 cursor-pointer"
										>
											<Star className="h-4 w-4" /> Make
											default
										</DropdownMenuItem>
									</>
								)}
								{/* <DropdownMenuItem
									onClick={() => setUsageOpenFor(card)}
									className="gap-2"
								>
									<ExternalLink className="h-4 w-4" /> View
									usage
								</DropdownMenuItem> */}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={removeCardFn}
									disabled={deleting}
									role="button"
									className="gap-2 cursor-pointer text-destructive focus:text-destructive"
								>
									{deleting ? (
										<>
											<LoaderIcon size={20} />
											Removing...
										</>
									) : (
										<>
											<Trash2 className="h-4 w-4" />{' '}
											Remove
										</>
									)}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-3 py-3">
				<div className="flex flex-wrap items-center justify-between gap-3 text-sm">
					<CardTitle className="flex items-center gap-2 text-base">
						<BrandPill brand={card.brand} />
						<span className="font-medium">•••• {card.last4}</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						<Title size={'size14'} margin="none">
							Expires
						</Title>
						<span className="font-medium">
							{expiryLabel(card.expMonth, card.expYear)}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					{isExpiringSoon(card.expMonth, card.expYear) && (
						<Badge
							className={styles.expireSoon}
							variant="destructive"
						>
							<Clock className="h-3 w-3" />
							Expiring soon
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
