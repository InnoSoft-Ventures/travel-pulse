import React from 'react';
import { icons } from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
	const LucideIcon = icons[name];

	return <LucideIcon {...props} />;
};

export { Icon };
