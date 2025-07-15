import dateJs from 'dayjs';

export interface DateRange {
	startDate: dateJs.Dayjs;
	endDate: dateJs.Dayjs;
}

/**
 * Calculate the number of travel days (inclusive)
 */
export function calculateTravelDays(
	startDate: dateJs.Dayjs,
	endDate: dateJs.Dayjs
) {
	return dateJs(dateJs(endDate)).diff(dateJs(startDate), 'day');
}

export { dateJs };
