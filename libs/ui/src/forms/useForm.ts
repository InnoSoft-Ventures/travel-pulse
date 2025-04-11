'use client';

import { useForm as useReactHookForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { useState } from 'react';

export const useForm = <TSchema extends ZodType<any, any>>(
	schema: TSchema,
	options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) => {
	const [isLoading, setLoading] = useState(false);

	const methods = useReactHookForm<z.infer<TSchema>>({
		resolver: zodResolver(schema),
		...options,
	});

	const formSubmit = (
		callback: (
			data: z.infer<TSchema>,
			done: () => void
		) => Promise<void> | void
	) => {
		return methods.handleSubmit(async (data) => {
			setLoading(true);

			const done = () => setLoading(false);

			await callback(data, done);
		});
	};

	return {
		...methods,
		isLoading,
		formSubmit,
	};
};

export { z as zod };
