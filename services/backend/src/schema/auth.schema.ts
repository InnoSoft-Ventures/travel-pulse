import { z } from 'zod';

export const EmailSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
});

export const FullNameSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
});

export const PasswordSchema = z.object({
	password: z.string().min(6).max(32),
});

export const SignUpSchema = z.object({
	...EmailSchema.shape,
	...PasswordSchema.shape,
	...FullNameSchema.shape,
});

export const SignInSchema = z.object({
	...EmailSchema.shape,
	...PasswordSchema.shape,
});

export const ForgotPasswordSchema = EmailSchema;

export const TokenSchema = z.object({
	token: z.string().min(32).max(150),
});

export const ResetPasswordSchema = z.object({
	...TokenSchema.shape,
	...PasswordSchema.shape,
});

export type SignUpType = z.infer<typeof SignUpSchema>;

export type SignInType = z.infer<typeof SignInSchema>;
