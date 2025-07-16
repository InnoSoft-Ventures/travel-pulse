import React from 'react';
import Link from 'next/link';
import styles from './style.module.scss';
import LogoSvg from '../../assets/logo.svg';
import LogoPurple from '../../assets/logo-purple.svg';

interface LogoProps {
	color?: 'light' | 'dark';
	variant?: 'primary' | 'secondary';
	iconStyle?: React.CSSProperties;
}

function Logo(props: LogoProps) {
	const { color = 'light', variant = 'primary', iconStyle } = props;

	const textColor = color === 'light' ? styles.light : styles.dark;
	const LogoNode = variant === 'primary' ? LogoSvg : LogoPurple;

	return (
		<div className="relative">
			<Link
				href="/"
				className={`flex items-center h-full ${styles.logo}`}
			>
				<div
					className={styles.logoIcon}
					data-variant={variant}
					style={iconStyle}
				>
					<LogoNode alt="TravelPulse Logo" />
				</div>
				<div className={`${styles.logoName} ${textColor}`}>
					TravelPulse -
				</div>
				<div className={`${styles.logoSlogan} ${textColor}`}>
					Your eSIM Connection Hub
				</div>
			</Link>
		</div>
	);
}

export { Logo };
