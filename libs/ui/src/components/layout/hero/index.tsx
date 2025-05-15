import * as React from 'react';
import { TopNav } from '../top-nav';
import ArtLines from './art-lines.svg';
import styles from './hero.module.scss';
import { Curve } from '../../curve';

interface HeroProp {
	children: React.ReactNode;
}

const Hero = (props: HeroProp) => {
	const { children } = props;

	return (
		<header className={styles.heroContainer}>
			<TopNav />
			<div className={styles.artLines}>
				<ArtLines
					style={{
						opacity: '64%',
					}}
				/>
			</div>
			{children}
			<Curve />
		</header>
	);
};

export { Hero };
