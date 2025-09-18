import { APIRequest } from '@travelpulse/api-service';

interface PaystackInitParams {
	email: string;
	amount: number; // in base currency units (will be converted to cents)
	currency: string; // e.g. NGN, USD (Paystack primary is NGN but supports others on some accounts)
	channels?: [
		| 'card'
		| 'bank'
		| 'apple_pay'
		| 'ussd'
		| 'qr'
		| 'mobile_money'
		| 'bank_transfer'
		| 'eft'
		| 'payattitude'
	];
	metadata?: Record<string, any>;
	reference?: string; // optional custom reference
	callbackUrl?: string; // redirect URL after payment
}

export interface PaystackInitResponse {
	status: boolean;
	message: string;
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export interface OneTimePaymentSession {
	provider: 'paystack';
	reference: string;
	authorizationUrl: string;
	accessCode: string;
}

/**
 * Create a Paystack one-time payment initialization.
 * Returns data required by the client popup library (reference + authorization URL).
 * The popup script can be launched using the reference or by redirecting to authorization_url.
 */
export async function initPaystackOneTimePayment(
	params: PaystackInitParams,
	secretKey: string,
	apiUrl: string
): Promise<OneTimePaymentSession> {
	// Paystack expects amount in the lowest currency denomination (cents for ZAR)
	const amountInMinorUnits = Math.round(params.amount * 100);

	const payload: Record<string, any> = {
		email: params.email,
		amount: amountInMinorUnits,
		channels: params.channels,
		currency: params.currency,
		metadata: params.metadata || {},
	};

	if (params.reference) payload.reference = params.reference;
	if (params.callbackUrl) payload.callback_url = params.callbackUrl;

	const response = await APIRequest.post<PaystackInitResponse>(
		`${apiUrl}/transaction/initialize`,
		payload,
		{
			headers: {
				Authorization: `Bearer ${secretKey}`,
			},
		}
	);

	if (!response.data.status || !response.data.data) {
		throw new Error(
			`Paystack init failed: ${response.data.message || 'Unknown error'}`
		);
	}

	const { authorization_url, access_code, reference } = response.data.data;

	return {
		provider: 'paystack',
		reference,
		authorizationUrl: authorization_url,
		accessCode: access_code,
	};
}

/** Generic shape so other providers can plug in similar functions later */
export type OneTimePaymentInitializer = (
	params: PaystackInitParams
) => Promise<OneTimePaymentSession>;
