import React from 'react';
import styles from './style.module.scss';
import { Hexagon } from '../hexagon';

interface SectionCardProps {
	variant?: 'primary' | 'secondary';
	title: string;
	description: string;
	icon: React.ReactNode;
}

const SectionCard = (props: SectionCardProps) => {
	const { title, description, icon, variant = 'primary' } = props;
	let cardStyles = '';

	if (variant === 'secondary') {
		cardStyles = styles.secondary;
	}
	return (
		<div className={`${styles.SecFeatureCard} ${cardStyles}`}>
			<div className={styles.IconContainer}>
				<div className={styles.hexagonBackground}>
					<Hexagon icon={icon} />
				</div>
				<div className={styles.infoContainer}>
					<div className={styles.title}>{title}</div>
					<div className={styles.description}>{description}</div>
				</div>
			</div>
		</div>
	);
};

export { SectionCard };
