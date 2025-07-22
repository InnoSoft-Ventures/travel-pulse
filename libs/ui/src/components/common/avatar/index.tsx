import React from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';

interface AvatarProps {
	src: string;
	alt: string;
	size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40 }) => {
	const style = {
		width: `${size}px`,
		height: `${size}px`,
	};

	return (
		<div className={styles.avatar} style={style}>
			<Image
				src={src}
				alt={alt}
				width={size}
				height={size}
				objectFit="cover"
			/>
		</div>
	);
};
