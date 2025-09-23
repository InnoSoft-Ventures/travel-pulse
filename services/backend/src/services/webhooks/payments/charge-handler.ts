import { PaystackChargeSuccessPayload } from '@travelpulse/interfaces';
import PaymentAttempt from '../../../db/models/PaymentAttempt';
import { BadRequestException } from '@travelpulse/middlewares';
import { confirmPaymentService } from '../../payments/confirm-payment.service';
import { PaymentCardCreationAttributes } from '../../../db/models/PaymentCard';
import { saveCardDetails } from '../../payment-cards/payment-card.service';
import dbConnect from '../../../db';
import { Transaction } from 'sequelize';
import { sendPaymentConfirmed } from '../../sse/payment-sse.service';

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
		transaction: transact,
	});

	if (!paymentDetails) {
		throw new BadRequestException('Payment attempt not found', null);
	}

	return paymentDetails;
}

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

// TODO: Verify amount matches expected amount,  save card details (authorization), then distribute product by calling confirmPaymentService method
export const handleChargeSuccess = async (
	data: PaystackChargeSuccessPayload['data']
) => {
	console.log('Handling charge success...', data);

	const transact = await dbConnect.transaction();

	// 1. Fetch order details using orderId from metadata
	const paymentDetails = await fetchPaymentDetails(data, transact);

	// 2. Verify charge amount and status
	if (!verifyChargeAmount(data.status, data.amount, paymentDetails.amount)) {
		throw new BadRequestException('Invalid charge amount or status', null);
	}

	// 4. Emit SSE to notify FE listeners
	sendPaymentConfirmed(paymentDetails.userId, {
		orderId: paymentDetails.orderId,
		paymentId: paymentDetails.id,
		referenceId: data.reference,
	});

	// 3. Send confirmation email

	// 4. Save card details (authorization)
	await handleCardSave(paymentDetails.userId, data, transact);

	// 5. Distribute product by calling confirmPaymentService method
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
