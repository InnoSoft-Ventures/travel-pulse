'use client';
import React from 'react';
import { Title } from '../common';

export type ActivityLogEntry = {
	id: string;
	description: string;
	esimName: string;
	status: 'Successful' | 'Failed' | string;
	date: string; // e.g. "14/04/2025"
	time: string; // e.g. "09:45 AM"
};

const sampleEntries: ActivityLogEntry[] = [
	{
		id: '1',
		description: 'Topped up Data',
		esimName: 'Travel eSIM',
		status: 'Successful',
		date: '08/04/2025',
		time: '18:45 PM',
	},
	{
		id: '2',
		description: 'Switched active plan',
		esimName: 'Work eSIM',
		status: 'Successful',
		date: '03/04/2025',
		time: '09:45 AM',
	},
];

export const ActivityLog = () => {
	const entries = sampleEntries;

	const handleActionClick = (entryId: string) => {
		console.log(`Action clicked for entry ID: ${entryId}`);
	};

	return (
		<div className="mt-8 p-6 bg-white rounded-lg shadow-sm w-full max-w-screen-lg">
			<Title size="size19">Activity log</Title>
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto">
					<thead>
						<tr className="text-left text-gray-700 border-b">
							<th className="py-2 px-3">Description</th>
							<th className="py-2 px-3">eSIM Name</th>
							<th className="py-2 px-3">Status</th>
							<th className="py-2 px-3">Date</th>
							<th className="py-2 px-3">Time</th>
							<th className="py-2 px-3">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						{entries.map((e, idx) => (
							<tr
								key={e.id}
								className={
									idx < entries.length - 1 ? 'border-b' : ''
								}
							>
								<td className="py-3 px-3 text-gray-800">
									{e.description}
								</td>
								<td className="py-3 px-3 text-gray-800">
									{e.esimName}
								</td>
								<td className="py-3 px-3 text-gray-800">
									{e.status}
								</td>
								<td className="py-3 px-3 text-gray-800">
									{e.date}
								</td>
								<td className="py-3 px-3 text-gray-800">
									{e.time}
								</td>
								<td className="py-3 px-3 text-right">
									<button
										onClick={() => handleActionClick(e.id)}
										className="p-1 hover:bg-gray-100 rounded-full"
									>
										{/* Using SVG ellipsis icon */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M6 10a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0zm-9 0a1 1 0 112 0 1 1 0 01-2 0z" />
										</svg>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
