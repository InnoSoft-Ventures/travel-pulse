export interface PaystackChargeSuccessPayload {
	event: 'charge.success';
	data: {
		status: string;
		reference: string;
		amount: number;
		gateway_response: string;
		paid_at: string;
		created_at: string;
		channel: string;
		currency: string;
		metadata: {
			orderId: string;
			userId: string;
			paymentAttemptId: string;
			orderNumber: string;
		};
		fees: number;
		authorization: {
			authorization_code: string;
			last4: string;
			exp_month: string;
			exp_year: string;
			channel: string;
			card_type: string;
			bank: string;
			country_code: string;
			brand: string;
			reusable: boolean;
			signature: string;
			account_name: string | null;
		};
		customer: {
			email: string;
			customer_code: string;
		};
	};
}

export interface PaystackRefundPendingPayload {
	event: 'refund.pending';
	data: {
		status: string;
		transaction_reference: string;
		refund_reference: string | null;
		amount: string;
		currency: string;
		processor: string;
		customer: {
			first_name: string;
			last_name: string;
			email: string;
		};
	};
}

export type PaystackWebhookPayload =
	| PaystackChargeSuccessPayload
	| PaystackRefundPendingPayload;
