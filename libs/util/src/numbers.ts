export function toCurrency(num: number | string, currency: string): string {
	return `${currency}${num}`;
}

export function toDecimalPoints<T = number | string>(
	num: number,
	currency?: string,
	decimalPoints = 2
): T {
	const decimalNumber = parseFloat(num.toFixed(decimalPoints));

	if (currency) {
		return toCurrency(decimalNumber, currency) as T;
	}

	return decimalNumber as T;
}
