import { z } from 'zod';

export const OrderPayloadSchema = z.object({
	packages: z.array(
		z.object({
			packageId: z.string(),
			quantity: z.number(),
			startDate: z.string().min(10).max(10),
		})
	),
	currency: z.string().min(3).max(3),
});

export type OrderPayload = z.infer<typeof OrderPayloadSchema>;
