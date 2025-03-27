import React from 'react';
import styles from './style.module.scss';
import LogoSvg from '@/assets/logo.svg';
import LogoPurple from '@/assets/logo-purple.svg';

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
		<div className={`flex items-center h-full ${styles.logo}`}>
			<div className={styles.logoIcon} style={iconStyle}>
				<LogoNode alt="TravelPulse Logo" />
			</div>
			<div className={`${styles.logoName} ${textColor}`}>
				TravelPulse -
			</div>
			<div className={`${styles.logoSlogan} ${textColor}`}>
				Your eSIM Connection Hub
			</div>
		</div>
	);
}

export default Logo;
