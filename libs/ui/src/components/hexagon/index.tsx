import React from 'react';
import styles from './style.module.scss';
import HexagonIcon from '../../assets/hexagon.svg';

interface HexagonProps {
	icon: React.ReactNode;
}

const Hexagon = (props: HexagonProps) => {
	const { icon } = props;
	return (
		<div className={styles.hexagonContainer}>
			<div className={styles.icon}>{icon}</div>
			<div className={styles.hexagon}>
				<HexagonIcon />
			</div>
		</div>
	);
};

export { Hexagon };
