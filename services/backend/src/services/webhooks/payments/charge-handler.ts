import { PaystackChargeSuccessPayload } from '@travelpulse/interfaces';
import PaymentAttempt from '../../../db/models/PaymentAttempt';
import { BadRequestException } from '@travelpulse/middlewares';
import { confirmPaymentService } from '../../payments/confirm-payment.service';
import { PaymentCardCreationAttributes } from '../../../db/models/PaymentCard';
import { saveCardDetails } from '../../payment-cards/payment-card.service';
import dbConnect from '../../../db';
import { Transaction } from 'sequelize';
import { sendPaymentConfirmed } from '../../sse/payment-sse.service';
import { sendPaymentConfirmedEmail } from '@travelpulse/services';
import User from '../../../db/models/User';

function verifyChargeAmount(
	status: string,
	expectedAmount: number,
	actualAmount: number
) {
	if (status !== 'success') {
		return false;
	}

	const amountInSmallestUnit = actualAmount * 100; // Convert to cents if Rands

	return expectedAmount === amountInSmallestUnit;
}

async function fetchPaymentDetails(
	data: PaystackChargeSuccessPayload['data'],
	transact: Transaction
) {
	const { orderId, paymentAttemptId, userId } = data.metadata;

	const paymentDetails = await PaymentAttempt.findOne({
		where: {
			id: paymentAttemptId,
			orderId,
			userId,
			referenceId: data.reference,
		},
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['email', 'firstName', 'lastName'],
				required: true,
			},
		],
		transaction: transact,
	});

	if (!paymentDetails) {
		throw new BadRequestException('Payment attempt not found', null);
	}

	return paymentDetails;
}

const processPaymentConfirmedEmail = async (
	paymentDetails: PaymentAttempt,
	orderNumber: string
) => {
	const userDetails = paymentDetails.user;

	const recipientEmail = paymentDetails.user?.email;

	if (!recipientEmail) {
		console.warn(
			`⚠️ Unable to send payment confirmation email; missing recipient for paymentAttempt ${paymentDetails.id}`
		);

		return;
	}

	const frontendBase = process.env.WEB_APP_URL || 'http://localhost:3000';
	const supportBase =
		process.env.SUPPORT_PORTAL_URL || `${frontendBase}/support`;

	const viewOrderUrl = new URL(
		`/app/settings/orders/${paymentDetails.orderId}`,
		frontendBase
	).toString();

	const amountValue =
		typeof paymentDetails.amount === 'string'
			? parseFloat(paymentDetails.amount)
			: paymentDetails.amount;

	void sendPaymentConfirmedEmail(recipientEmail, {
		firstName: userDetails?.firstName || 'there',
		lastName: userDetails?.lastName || '',
		orderNumber,
		paymentId: String(paymentDetails.id),
		amount: amountValue,
		currency: paymentDetails.currency,
		viewOrderUrl,
		supportUrl: supportBase,
	}).catch((error) => {
		console.error(
			`❌ Failed to send payment confirmation email for paymentAttempt ${paymentDetails.id}`,
			error
		);
	});
};

const handleCardSave = async (
	userId: number,
	data: PaystackChargeSuccessPayload['data'],
	transact: Transaction
) => {
	const { authorization, customer } = data;

	const cardDetails: PaymentCardCreationAttributes = {
		userId,
		default: true,
		provider: 'paystack',
		customerCode: customer.customer_code ?? null,
		brand: authorization.brand ?? null,
		last4: authorization.last4 ?? null,
		expMonth: authorization.exp_month
			? parseInt(authorization.exp_month, 10)
			: null,
		expYear: authorization.exp_year
			? parseInt(authorization.exp_year, 10)
			: null,
		authorizationCode: authorization.authorization_code,
		signature: authorization.signature ?? null,
		bank: authorization.bank ?? null,
		countryCode: authorization.country_code ?? null,
		cardType: authorization.card_type ?? null,
		reusable: authorization.reusable ?? null,
		accountName: authorization.account_name ?? null,
	} as const;

	await saveCardDetails(cardDetails, transact);
};

export const handleChargeSuccess = async (
	data: PaystackChargeSuccessPayload['data']
) => {
	console.log('Handling charge success...', data);

	// If it is a subscription payment it would have a plan object
	if (data.plan) {
		return;
	}

	const transact = await dbConnect.transaction();

	// 1. Fetch order details using orderId from metadata
	const paymentDetails = await fetchPaymentDetails(data, transact);

	// 2. Verify charge amount and status
	if (!verifyChargeAmount(data.status, data.amount, paymentDetails.amount)) {
		throw new BadRequestException('Invalid charge amount or status', null);
	}

	// 3. Emit SSE to notify FE listeners
	sendPaymentConfirmed(paymentDetails.userId, {
		orderId: paymentDetails.orderId,
		paymentId: paymentDetails.id,
		referenceId: data.reference,
	});

	// 4. Send confirmation email
	await processPaymentConfirmedEmail(
		paymentDetails,
		data.metadata.orderNumber
	);

	// 5. Save card details (authorization)
	await handleCardSave(paymentDetails.userId, data, transact);

	// 6. Distribute product by calling confirmPaymentService method
	await confirmPaymentService(
		{
			orderId: paymentDetails.orderId,
			userId: paymentDetails.userId,
			paymentAttemptId: paymentDetails.id,
			referenceId: data.reference,
		},
		transact
	);
};
