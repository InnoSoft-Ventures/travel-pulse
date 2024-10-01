import { z } from 'zod';

export const OrderPayloadSchema = z.object({
	packages: z.array(
		z.object({
			packageId: z.number(),
			quantity: z.number(),
			startDate: z.string().min(10).max(10),
		})
	),
});

export type OrderPayload = z.infer<typeof OrderPayloadSchema>;
