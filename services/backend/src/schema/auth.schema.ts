import { PasswordSchema } from '@travelpulse/interfaces/schemas';
import { z } from 'zod';

export const TokenSchema = z.object({
	token: z.string().min(32).max(150),
});

export const ResetPasswordSchema = z.object({
	...TokenSchema.shape,
	...PasswordSchema.shape,
});

export const EmailSchema = z.object({
	email: z.string().email().min(1).trim().toLowerCase(),
});
