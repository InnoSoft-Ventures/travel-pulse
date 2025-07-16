import React from 'react';
import { Logo } from '../../logo';
import styles from './styles.module.scss';
import { Button } from '../../common';

import ArrowIcon from '../../../assets/arrow.svg';

export const MinimalNav = () => {
	return (
		<nav className={styles.minimalNav}>
			<div className={styles.inner}>
				<div>
					<Logo color="dark" variant="secondary" />
				</div>
				<div className={styles.right}>
					<div className={styles.currency}>USD ($)</div>
					<div>
						<Button
							variant="outline"
							endContent={
								<ArrowIcon
									className={styles.dropdownBtnArrow}
								/>
							}
						>
							My Account
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
};
