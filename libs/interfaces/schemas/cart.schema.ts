import { z } from 'zod';

export const CartItemSchema = z.object({
	packageId: z.string(),
	name: z.string(),
	flag: z.string(),
	startDate: z.string(),
	quantity: z.number().min(1),
});

export const CartSchema = z.object({
	items: z.array(CartItemSchema),
});

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
