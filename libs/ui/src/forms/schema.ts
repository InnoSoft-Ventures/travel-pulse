import { z } from 'zod';

export const AuthSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email. Please enter a valid email address')
		.trim()
		.toLowerCase(),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(6, { message: 'Password must be at least 6 characters' })
		.max(20, { message: 'Password must be between 6 and 20 characters' })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
			{
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			}
		),
});

export const RegisterSchema = AuthSchema.extend({
	firstName: z.string().min(1, 'First name is required').min(2, {
		message: 'First name must be at least 2 characters',
	}),
	lastName: z.string().min(1, 'Last name is required').min(2, {
		message: 'Last name must be at least 2 characters',
	}),
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const LoginSchema = AuthSchema;

export type LoginFormValues = z.infer<typeof LoginSchema>;
