'use client';

import React from 'react';
import Image from 'next/image';
import { Button, Input, Title, CountryPicker } from '@travelpulse/ui';
import { Country } from '@travelpulse/interfaces';

export const AccountInformation = () => {
	const handleCountryChange = (selectedCountry: Country) => {
		console.log('Selected country', selectedCountry);
	};

	return (
		<div className="bg-white rounded-md shadow-sm px-8 py-10 mt-8">
			<Title size="size19">Account Information</Title>
			<Title color="tertiary" size={'size14'}>
				Update your account details and personal information.
			</Title>

			<div className="mt-9">
				<div className="flex gap-8 flex-wrap">
					<div className="flex flex-col gap-6 w-full max-w-md">
						<Input
							variant="primary"
							radius="sm"
							label="Full Name"
							id="full-name"
							type="text"
							placeholder="Enter your full name"
							defaultValue="Martin Rollins"
						/>

						<Input
							variant="primary"
							radius="sm"
							id="phone-number"
							type="text"
							label="Phone Number"
							placeholder="Enter your phone number"
							defaultValue="+27 (60) 320-7047"
						/>

						<Input
							variant="primary"
							radius="sm"
							id="email"
							label="Email Address"
							placeholder="Enter your email address"
							type="email"
							disabled
							defaultValue="martin.rollins@gmail.com"
						/>

						<CountryPicker
							onData={handleCountryChange}
							name="country-search"
							radius="sm"
							label="Country"
							id="country"
							placeholder="Where do you need internet?"
							aria-label="Select an destination"
							hideDropdownIndicator={false}
							controlVariant="tertiary"
							required
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
				<Button variant="outline" className="rounded-full px-6">
					Cancel
				</Button>
				<Button disabled type="submit">
					Save changes
				</Button>
			</div>
		</div>
	);
};
