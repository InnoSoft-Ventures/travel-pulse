import styles from './style.module.scss';
import HexagonIcon from '@/assets/hexagon.svg';
import SettingsIcon from '@/assets/settings-gear.svg';

const Hexagon = () => {
	return (
		<div className={styles.hexagonContainer}>
			<div className={styles.icon}>
				<SettingsIcon />
			</div>
			<div className={styles.hexagon}>
				<HexagonIcon />
			</div>
		</div>
	);
};

export { Hexagon };
