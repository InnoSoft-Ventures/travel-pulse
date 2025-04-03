import React from 'react';
import PhoneCheck from '../../assets/phone-check.svg';
import styles from './compatibility-checker.module.scss';

function CompatibilityChecker() {
	return (
		<button className={styles.compatibilityCheckBtn}>
			Check compatibility
			<PhoneCheck />
		</button>
	);
}

export { CompatibilityChecker };
