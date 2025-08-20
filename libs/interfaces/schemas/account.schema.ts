import { z } from 'zod';

const BaseUpdateProfileSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, { message: 'First name is required' })
		.max(50, { message: 'First name must be at most 50 characters' })
		.optional(),
	lastName: z
		.string()
		.trim()
		.min(1, { message: 'Last name is required' })
		.max(50, { message: 'Last name must be at most 50 characters' })
		.optional(),
	phone: z
		.string()
		.trim()
		.regex(/^\+?[0-9]{7,15}$/u, {
			message:
				'Phone must be a valid international number (e.g., +1234567890)',
		})
		.optional(),
});

export const UpdateProfileInputSchema = z
	.object({
		...BaseUpdateProfileSchema.shape,
		country: z
			.object(
				{
					id: z.number().min(1, { message: 'Country is required' }),
					name: z.string().min(1),
				},
				{
					required_error: 'Country is required',
					invalid_type_error: 'Country is required',
				}
			)
			.optional(),
	})
	.refine(
		(data) => {
			return (
				(typeof data.firstName === 'string' &&
					data.firstName.length > 0) ||
				(typeof data.lastName === 'string' &&
					data.lastName.length > 0) ||
				(typeof data.phone === 'string' && data.phone.length > 0) ||
				Boolean(data.country)
			);
		},
		{
			message: 'Provide at least one field to update',
			path: ['firstName'],
		}
	);

export const UpdateProfileSchema = z.object({
	...BaseUpdateProfileSchema.shape,
	countryId: z
		.number({
			required_error: 'Country ID is required',
			invalid_type_error: 'Country ID is required',
		})
		.optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
