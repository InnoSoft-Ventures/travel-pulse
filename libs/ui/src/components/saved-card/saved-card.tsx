import React from 'react';
import { Trash2, Star, StarOff, MoreHorizontal, Clock } from 'lucide-react';

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
	CardFooter,
	CardHeader,
	CardTitle,
	Title,
} from '../common';
import { PaymentCard } from '@travelpulse/interfaces';
import { classNames } from '../../utils';

interface SavedCardProps {
	card: PaymentCard;
	makeDefault: (id: number) => void;
	removeCard: (id: number) => void;
}

export function SavedCard({ card, makeDefault, removeCard }: SavedCardProps) {
	return (
		<Card key={card.id} className="relative overflow-hidden">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<BrandPill brand={card.brand} />
						<span className="font-medium">•••• {card.last4}</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						{card.isDefault ? (
							<Badge variant="secondary" className="gap-1">
								<Star className="h-3 w-3" />
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
											onClick={() => makeDefault(card.id)}
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
									onClick={() => removeCard(card.id)}
									role="button"
									className="gap-2 cursor-pointer text-destructive focus:text-destructive"
								>
									<Trash2 className="h-4 w-4" /> Remove
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-2">
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<Title
							size={'size14'}
							className="text-muted-foreground"
						>
							Nickname
						</Title>
						<span className="font-medium">
							{card.cardName || '—'}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Title
							size={'size14'}
							className="text-muted-foreground"
						>
							Expires
						</Title>
						<span className="font-medium">
							{expiryLabel(card.expMonth, card.expYear)}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{isExpiringSoon(card.expMonth, card.expYear) && (
						<Badge className="gap-1" variant="destructive">
							<Clock className="h-3 w-3" />
							Expiring soon
						</Badge>
					)}
				</div>
			</CardContent>

			<CardFooter className="justify-between">
				{!card.isDefault ? (
					<Button
						variant="secondary"
						size="sm"
						onClick={() => makeDefault(card.id)}
						className="gap-2"
					>
						<Star className="h-4 w-4" />
						Make default
					</Button>
				) : (
					<Button
						variant="secondary"
						size="sm"
						disabled
						className="gap-2"
					>
						<StarOff className="h-4 w-4" />
						Default set
					</Button>
				)}

				<div className="flex gap-2">
					{/* <Button
						variant="outline"
						size="sm"
						onClick={() => setUsageOpenFor(card)}
						className="gap-2"
					>
						<ExternalLink className="h-4 w-4" />
						Usage
					</Button> */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => removeCard(card.id)}
						className="gap-2 text-destructive"
					>
						<Trash2 className="h-4 w-4" />
						Remove
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}

// Lightweight brand pill (kept local to avoid external assets)
const BrandPill: React.FC<{ brand: PaymentCard['brand'] }> = ({ brand }) => {
	const map: Record<PaymentCard['brand'], { label: string; bg: string }> = {
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

function expiryLabel(m: number, y: number) {
	const mm = String(m).padStart(2, '0');
	return `${mm} / ${String(y).slice(-2)}`;
}

function isExpiringSoon(m: number, y: number): boolean {
	const now = new Date();
	const lastOfMonth = new Date(y, m, 0); // end of expiry month
	const diffMs = lastOfMonth.getTime() - now.getTime();
	const days = diffMs / (1000 * 60 * 60 * 24);
	return days <= 60; // 60-day window
}
