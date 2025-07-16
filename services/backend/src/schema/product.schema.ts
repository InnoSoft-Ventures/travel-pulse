import { dateJs } from '@travelpulse/utils';
import { z } from 'zod';

export const ProductSearchSchema = z
	.object({
		query: z
			.string({
				invalid_type_error: 'Query must be a string',
				required_error: 'Query is required',
			})
			.trim()
			.toUpperCase()
			.min(2, 'Query must be at least 2 characters long')
			.max(50, 'Query must be at most 50 characters long'),
		targetDestination: z.enum(['local', 'regional', 'global'], {
			invalid_type_error:
				'Target destination must be one of: local, regional, global',
			required_error: 'Target destination is required',
		}),
		from: z
			.string({
				required_error: 'Start date is required',
				invalid_type_error: 'Start date must be a string',
			})
			.superRefine((date, ctx) => {
				if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Start date must be in the format: yyyy-mm-dd',
					});
					return;
				}

				if (!dateJs(date, 'YYYY-MM-DD', true).isValid()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid start date value.',
					});
					return;
				}
			}),
		to: z
			.string({
				required_error: 'End date is required',
				invalid_type_error: 'End date must be a string',
			})
			.superRefine((end, ctx) => {
				if (!/^\d{4}-\d{2}-\d{2}$/.test(end)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'End date must be in the format: yyyy-mm-dd',
					});
					return;
				}

				if (!dateJs(end, 'YYYY-MM-DD', true).isValid()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid end date value.',
					});
					return;
				}
			}),
	})
	.superRefine((data, ctx) => {
		const startDate = dateJs(data.from, 'YYYY-MM-DD');
		const endDate = dateJs(data.to, 'YYYY-MM-DD');
		const today = dateJs().startOf('day');

		if (startDate.isBefore(today)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Start date cannot be in the past.',
				path: ['from'],
			});
		}

		if (startDate.isAfter(endDate)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Start date cannot be later than end date.',
				path: ['from'],
			});
		}
	});

export type ProductSearch = z.infer<typeof ProductSearchSchema>;
