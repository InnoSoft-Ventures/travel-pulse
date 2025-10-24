'use client';
import React, { useState } from 'react';
import { PaymentCardCreation } from '@travelpulse/interfaces';
import { Badge, Input, Modal, Title } from '../common';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface AddCardProps {
	onAddCard: (card: PaymentCardCreation) => void;
}

export function AddCard({ onAddCard }: AddCardProps) {
	const [cardholder, setCardholder] = useState('');
	const [, setLoading] = useState(false);
	const [addOpen, setAddOpen] = useState(false);

	// Fake tokenization to simulate Paystack success
	function simulatePaystack() {
		setLoading(true);

		setTimeout(() => {
			onAddCard({
				expMonth: 12,
				expYear: new Date().getFullYear() + 2,
				cardName: cardholder,
			});

			setLoading(false);
		}, 900);
	}

	return (
		<>
			<Modal
				open={addOpen}
				onClose={() => setAddOpen(false)}
				title="Add new card"
				onOk={simulatePaystack}
				description="We use Paystack to securely tokenize your card. Your details never hit our servers."
			>
				<div className="grid gap-4 py-2">
					{/* Cardholder name */}
					<div className="grid gap-2">
						<Input
							id="cardholder"
							label="Name on card"
							placeholder="As displayed on the card"
							value={cardholder}
							onChange={(e) => setCardholder(e.target.value)}
						/>
					</div>

					{/* Paystack iframe placeholder */}
					<div className="grid gap-2">
						<Title size="size16">Card details</Title>
						<div className="rounded-xl border p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<CreditCard className="h-5 w-5" />
									<div>
										<div className="font-medium">
											Secure fields by Paystack
										</div>
										<div className="text-xs text-muted-foreground">
											Card number, expiry, and CVV are
											captured in an embedded Paystack
											element.
										</div>
									</div>
								</div>
								<Badge variant="secondary" className="gap-1">
									<ShieldCheck className="h-3 w-3" />
									PCI DSS
								</Badge>
							</div>
							<div className="mt-3 rounded-lg border-dashed border p-4 text-sm text-muted-foreground">
								{/* Replace this container with the actual Paystack card element / popup trigger */}
								<div className="mb-2">
									This is a placeholder. On integration, mount
									Paystack inline fields here or trigger the
									popup for tokenization.
								</div>
								<div className="flex flex-wrap gap-2 text-[10px]">
									<span className="px-1.5 py-0.5 rounded bg-blue-600 text-white">
										VISA
									</span>
									<span className="px-1.5 py-0.5 rounded bg-red-600 text-white">
										MC
									</span>
									<span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white">
										AMEX
									</span>
									<span className="px-1.5 py-0.5 rounded bg-orange-600 text-white">
										VERVE
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
}
