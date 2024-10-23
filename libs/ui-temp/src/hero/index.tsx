import * as React from 'react';
import { TopNav } from '../top-nav';
import ArtLines from './art-lines.svg';
import WhiteCurve from './white-wave.svg';
import styles from './hero.module.scss';

interface HeroProp {
	children: React.ReactNode;
}

const Hero = (props: HeroProp) => {
	const { children } = props;

	return (
		<div className={styles.heroContainer}>
			<TopNav />
			<div className={styles.artLines}>
				<ArtLines
					style={{
						opacity: '64%',
					}}
				/>
			</div>
			{children}
			<div className={styles.curve}>
				<WhiteCurve />
			</div>
		</div>
	);
};

export { Hero };
