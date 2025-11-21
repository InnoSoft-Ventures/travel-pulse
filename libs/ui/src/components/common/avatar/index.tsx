'use client';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import { getInitials, getColorFromString } from '@travelpulse/utils';

interface AvatarProps {
	src?: string;
	alt: string;
	size?: number;
	firstName?: string;
	lastName?: string;
	fallbackColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt,
	size = 40,
	firstName,
	lastName,
	fallbackColor,
}) => {
	const [imageError, setImageError] = useState(false);
	const shouldShowInitials = !src || imageError;
	const initials = getInitials(firstName, lastName);
	const backgroundColor =
		fallbackColor ||
		getColorFromString(`${firstName || ''}${lastName || ''}`);

	const style = {
		width: `${size}px`,
		height: `${size}px`,
		backgroundColor: shouldShowInitials ? backgroundColor : 'transparent',
	};

	const fontSize = Math.floor(size * 0.4); // 40% of avatar size

	return (
		<div className={styles.avatar} style={style}>
			{shouldShowInitials ? (
				<span
					className={styles.initials}
					style={{ fontSize: `${fontSize}px` }}
				>
					{initials}
				</span>
			) : (
				<Image
					src={src!}
					alt={alt}
					width={size}
					height={size}
					objectFit="cover"
					onError={() => setImageError(true)}
				/>
			)}
		</div>
	);
};
