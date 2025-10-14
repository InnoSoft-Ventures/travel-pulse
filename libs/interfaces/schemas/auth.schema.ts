import { z } from 'zod';

export const EmailSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email. Please enter a valid email address')
		.trim()
		.toLowerCase(),
});

export const PasswordSchema = z.object({
	password: z
		.string()
		.min(1, 'Password is required')
		.min(6, { message: 'Password must be at least 6 characters' })
		.max(20, { message: 'Password must be between 6 and 20 characters' })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/,
			{
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			}
		),
});

export const AuthSchema = z.object({
	...EmailSchema.shape,
	...PasswordSchema.shape,
});

export const RegisterSchema = AuthSchema.extend({
	firstName: z
		.string()
		.trim()
		.min(1, 'First name is required')
		.min(2, {
			message: 'First name must be at least 2 characters',
		})
		.max(50, { message: 'First name must be at most 50 characters' }),
	lastName: z
		.string()
		.trim()
		.min(1, 'Last name is required')
		.min(2, {
			message: 'Last name must be at least 2 characters',
		})
		.max(50, { message: 'Last name must be at most 50 characters' }),
});

export const LoginSchema = AuthSchema;
export const ForgotPasswordSchema = EmailSchema;

export const NewPasswordSchema = PasswordSchema.extend({
	confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type EmailFormValues = z.infer<typeof EmailSchema>;
export type NewPasswordFormValues = z.infer<typeof NewPasswordSchema>;
export type ForgotPasswordSchemaValues = z.infer<typeof ForgotPasswordSchema>;
