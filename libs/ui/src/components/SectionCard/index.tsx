import React from 'react';
import styles from './style.module.scss';
import { Hexagon } from '../hexagon';

interface SectionCardProps {
	varient?: 'primary' | 'secondary';
	title: string;
	description: string;
	icon: React.ReactNode;
}

const SectionCard = (props: SectionCardProps) => {
	const { title, description, icon, varient = 'primary' } = props;
	let cardStyles = '';

	if (varient === 'secondary') {
		cardStyles = styles.secondary;
	}
	return (
		<div className={`${styles.SecFeatureCard} ${cardStyles}`}>
			<div className={styles.IconContainer}>
				<Hexagon icon={icon} />
				<div className={styles.infoContainer}>
					<div className={styles.title}>{title}</div>
					<div className={styles.description}>{description}</div>
				</div>
			</div>
		</div>
	);
};

export { SectionCard };
