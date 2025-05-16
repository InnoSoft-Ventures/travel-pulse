import { z } from 'zod';

export const DateRangeSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
});

export const CountrySchema = z.object({
	country: z.string().min(1, 'Country is required'),
});

export type DateRangeFormValues = z.infer<typeof DateRangeSchema>;
export type CountryFormValues = z.infer<typeof CountrySchema>;
