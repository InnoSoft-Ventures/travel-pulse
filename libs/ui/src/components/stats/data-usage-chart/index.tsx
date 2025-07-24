'use client';

import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from 'recharts';
import React from 'react';

interface DataPoint {
	month: string;
	value: number;
}

interface DataUsageChartProps {
	data: DataPoint[];
	strokeColor: string;
	gradientId: string;
	gradientStart: string;
	gradientEnd: string;
}

export const DataUsageChart: React.FC<DataUsageChartProps> = ({
	data,
	strokeColor,
	gradientId,
	gradientStart,
	gradientEnd,
}) => (
	<div className="w-full h-[369px]">
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={data}
				margin={{ top: 20, right: 30, left: 6, bottom: 15 }}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor={gradientStart}
							stopOpacity={0.48}
						/>
						<stop
							offset="95%"
							stopColor={gradientEnd}
							stopOpacity={0.06}
						/>
					</linearGradient>
				</defs>

				<CartesianGrid
					strokeDasharray="3 3"
					stroke="#CCCCCC"
					opacity={0.2}
				/>

				<XAxis
					dataKey="month"
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#A7A7A7', fontSize: 14, fontWeight: 500 }}
				/>

				<YAxis
					tickLine={false}
					axisLine={false}
					tick={{
						fill: '#A7A7A7',
						fontSize: 14,
						fontWeight: 500,
					}}
					tickFormatter={(n) => `${n}GB`}
				/>

				<Tooltip
					contentStyle={{
						borderRadius: 8,
						boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
					}}
				/>

				<Area
					type="natural"
					dataKey="value"
					stroke={strokeColor}
					strokeWidth={2}
					fill={`url(#${gradientId})`}
					fillOpacity={1}
					baseValue="dataMin"
					activeDot={{ r: 4, fill: strokeColor }}
				/>
			</AreaChart>
		</ResponsiveContainer>
	</div>
);
