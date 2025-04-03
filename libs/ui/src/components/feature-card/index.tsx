import React from 'react';
import styles from './style.module.scss';
import { Hexagon } from '../hexagon';

const FeatureCard = () => {
	return (
		<div className={styles.featureCardContainer}>
			<div className={styles.featureCard}>
				<div className={styles.iconContainer}>
					<Hexagon />
				</div>
				<div className={styles.textContainer}>
					<div className={styles.title}>Enjoy dual SIMs</div>
					<div className={styles.description}>
						Enjoy the flexibility of our digital eSIM while keeping
						the option to use your original SIM as usual whenever
						you need it.
					</div>
				</div>
			</div>
		</div>
	);
};

export { FeatureCard };
