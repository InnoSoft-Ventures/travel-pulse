import { CartDetails, CartItem } from '@travelpulse/interfaces';
import { Cart } from '@travelpulse/interfaces/schemas/cart.schema';
import Package from '../db/models/Package';
import { Op } from 'sequelize';
import {
	DEFAULT_CURRENCY,
	toCurrency,
	toDecimalPoints,
} from '@travelpulse/utils';

const getProductDetails = async (productIds: string[]) => {
	const packages = await Package.findAll({
		where: {
			id: {
				[Op.in]: productIds,
			},
		},
	});

	return new Map(
		packages.map((p) => [p.id.toString(), p.get({ plain: true })])
	);
};

export const processCartService = async (cart: Cart): Promise<CartDetails> => {
	// Find product details for each item
	const productDetailsMap = await getProductDetails(
		cart.items.map((item) => item.packageId)
	);

	const currency = DEFAULT_CURRENCY;
	let subtotal = 0;

	const items: CartItem[] = [];

	cart.items.forEach((item) => {
		const productDetails = productDetailsMap.get(item.packageId);

		if (productDetails) {
			const details: CartItem = {
				...item,
				finalPrice: toDecimalPoints<string>(
					productDetails.price * item.quantity,
					currency
				),
				// Will be used for displaying the original price
				// originalPrice: productDetails.price,
				data: productDetails.data,
				validity: `${productDetails.day} Days`,
			};

			subtotal += productDetails.price * details.quantity;
			items.push(details);
		}
	});

	const subTotalTwoDecimal = toDecimalPoints<number>(subtotal);

	const discount = 0;
	const bundleDiscount = 0;
	const total = toDecimalPoints<number>(
		subTotalTwoDecimal - discount - bundleDiscount
	);

	return {
		items,
		details: {
			subtotal: toCurrency(subTotalTwoDecimal, currency),
			discount,
			bundleDiscount,
			taxesAndFees: 'Included',
			total,
			totalPrice: toCurrency(total, currency),
			currency,
		},
	};
};
