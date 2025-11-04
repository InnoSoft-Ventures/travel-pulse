import { ProviderFactoryData } from '@travelpulse/interfaces';

/**
 * Converts order metadata between its JSON string representation and the structured
 * `ProviderFactoryData` shape.
 *
 * @param data - * When a `string`, attempts to parse and return the structured metadata.
 *              * When an `object`, serializes and returns a JSON string.
 */
export function orderMetaUtil(data: string): ProviderFactoryData;
export function orderMetaUtil(data: ProviderFactoryData): string;

export function orderMetaUtil(
	data: string | ProviderFactoryData
): string | ProviderFactoryData {
	if (typeof data === 'string') {
		return JSON.parse(data) as ProviderFactoryData;
	}

	return JSON.stringify({
		orderItemId: data.orderItemId,
		packageId: data.packageId,
		quantity: data.quantity,
		type: data.type,
	});
}
