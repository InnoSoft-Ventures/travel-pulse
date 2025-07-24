'use client';
import React from 'react';
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';
import { StatTooltip } from '../stat-tooltip/stat-tooltip';

interface FillConfigSolid {
	type: 'solid';
	fillColor: string;
}
interface FillConfigGradient {
	type: 'gradient';
	gradientId: string;
	gradientStart: string;
	gradientEnd: string;
}
type FillConfig = FillConfigSolid | FillConfigGradient;

interface UsageStatChartProps {
	data: { index: number; value: number }[];
	strokeColor: string;
	fillConfig: FillConfig;
}

export const UsageStatChart: React.FC<UsageStatChartProps> = ({
	data,
	strokeColor,
	fillConfig,
}) => (
	<ResponsiveContainer width="100%" height="100%">
		<AreaChart
			data={data}
			margin={{ top: 20, bottom: 20, left: 0, right: 0 }}
		>
			<defs>
				{fillConfig.type === 'gradient' && (
					<linearGradient
						id={fillConfig.gradientId}
						x1="0"
						y1="0"
						x2="0"
						y2="1"
					>
						<stop
							offset="0%"
							stopColor={fillConfig.gradientStart}
							stopOpacity={0.4}
						/>
						<stop
							offset="100%"
							stopColor={fillConfig.gradientEnd}
							stopOpacity={0.05}
						/>
					</linearGradient>
				)}
			</defs>

			<CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
			<XAxis dataKey="index" hide />
			<Tooltip
				content={<StatTooltip />}
				cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
			/>

			<Area
				type="natural"
				dataKey="value"
				stroke={strokeColor}
				strokeWidth={2}
				baseValue="dataMin"
				fill={
					fillConfig.type === 'gradient'
						? `url(#${fillConfig.gradientId})`
						: fillConfig.fillColor
				}
				fillOpacity={fillConfig.type === 'solid' ? 0.3 : 1}
				activeDot={false}
			/>
		</AreaChart>
	</ResponsiveContainer>
);
