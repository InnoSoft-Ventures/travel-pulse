import React from 'react';

export const PaymentCardUsage = () => {
	return (
		<Sheet
			open={!!usageOpenFor}
			onOpenChange={(open) => !open && setUsageOpenFor(null)}
		>
			<SheetContent side="right" className="w-[420px] sm:w-[520px] p-0">
				<div className="p-6 border-b">
					<SheetHeader>
						<SheetTitle>Card usage</SheetTitle>
						<SheetDescription>
							Recent transactions and authorizations for ••••{' '}
							{usageOpenFor?.last4}
						</SheetDescription>
					</SheetHeader>
				</div>
				<ScrollArea className="h-[calc(100vh-6rem)] p-6">
					<div className="space-y-4">
						{usageOpenFor &&
							mockUsage(usageOpenFor).map((u) => (
								<div
									key={u.id}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div>
										<div className="font-medium">
											{u.desc}
										</div>
										<div className="text-xs text-muted-foreground">
											{new Date(u.ts).toLocaleString()}
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold">
											{u.currency} {u.amount}
										</div>
										<div className="text-xs text-muted-foreground">
											Auth ref: {u.id.slice(-6)}
										</div>
									</div>
								</div>
							))}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};
