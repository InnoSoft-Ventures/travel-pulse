'use client';

import React from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button, Input, Title } from '@travelpulse/ui';
import { FormCountryPicker } from '@travelpulse/ui';
import { Country } from '@travelpulse/interfaces';
import { useAppDispatch, useAppSelector } from '@travelpulse/ui/state';
import { updateAccount, fetchAccount } from '@travelpulse/ui/thunks';
import { useForm } from '@travelpulse/ui/forms';
import {
	UpdateProfile,
	UpdateProfileInput,
	UpdateProfileInputSchema,
} from '@travelpulse/interfaces/schemas';

export const AccountInformation = () => {
	// Get user data from a global state or context if needed
	const { data: user, status } = useAppSelector(
		(state) => state.account.user.session
	);
	const dispatch = useAppDispatch();

	const {
		register,
		formSubmit,
		formState: { errors },
		control,
	} = useForm(UpdateProfileInputSchema, {
		mode: 'all',
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phoneNumber,
			country: undefined,
		},
	});

	useEffect(() => {
		dispatch(fetchAccount());
	}, [dispatch]);

	const onSave = (data: UpdateProfileInput) => {
		const countryId = data.country?.id;

		delete data.country;

		let payload = data as UpdateProfile;

		if (countryId) {
			payload.countryId = countryId;
		}

		dispatch(updateAccount(payload) as any);
	};

	return (
		<div className="bg-white rounded-md shadow-sm px-8 py-10 mt-8">
			<Title size="size19">Account Information</Title>
			<Title color="tertiary" size={'size14'}>
				Update your account details and personal information.
			</Title>

			<form onSubmit={formSubmit(onSave)}>
				<div className="mt-9">
					<div className="flex gap-8 flex-wrap">
						<div className="flex flex-col gap-6 w-full max-w-md">
							<Input
								variant="primary"
								radius="sm"
								label="First Name"
								id="first-name"
								type="text"
								placeholder="Enter your first name"
								{...register('firstName')}
								error={errors.firstName?.message}
							/>

							<Input
								variant="primary"
								radius="sm"
								label="	Last Name"
								id="last-name"
								type="text"
								placeholder="Enter your last name"
								{...register('lastName')}
								error={errors.lastName?.message}
							/>

							<Input
								variant="primary"
								radius="sm"
								id="phone-number"
								type="text"
								label="Phone Number"
								placeholder="Enter your phone number"
								{...register('phone')}
								error={errors.phone?.message}
							/>

							<Input
								variant="primary"
								radius="sm"
								id="email"
								label="Email Address"
								placeholder="Enter your email address"
								type="email"
								disabled
								defaultValue={user.email}
							/>

							<FormCountryPicker
								control={control}
								defaultValue={
									(user.country as Country) || undefined
								}
								name="country"
								radius="sm"
								label="Country"
								id="country"
								placeholder="Select your country"
								aria-label="Select a country"
								hideDropdownIndicator={false}
								controlVariant="tertiary"
								rules={{ required: 'Country is required' }}
							/>
						</div>

						<div className="flex flex-col gap-6 justify-between">
							<div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow">
								<Image
									src="https://randomuser.me/api/portraits/men/25.jpg"
									alt="Profile"
									width={150}
									height={150}
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-4 justify-end mt-10">
					<Button
						variant="outline"
						type="button"
						className="rounded-full px-6"
					>
						Cancel
					</Button>
					<Button type="submit" isLoading={status === 'loading'}>
						Save changes
					</Button>
				</div>
			</form>
		</div>
	);
};
