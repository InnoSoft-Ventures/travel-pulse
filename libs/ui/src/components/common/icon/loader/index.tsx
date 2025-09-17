import React from 'react';
import { Icon } from '../icon';

interface LoaderIconProps {
	size?: number;
}

export const LoaderIcon = ({ size = 24 }: LoaderIconProps) => {
	return (
		<Icon
			width={size}
			height={size}
			name="LoaderCircle"
			className="animate-spin"
		/>
	);
};
