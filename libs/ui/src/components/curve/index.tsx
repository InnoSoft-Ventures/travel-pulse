import React from 'react';
import styles from './curve.module.scss';
import WhiteCurve from '../../assets/white-wave.svg';

interface CurveProps {
	variant?: 'primary' | 'secondary';
}

const Curve = (props: CurveProps) => {
	const { variant } = props;
	let classNames = styles.curveContainer;
	if (variant === 'secondary') {
		classNames += ` ${styles.secondaryCurve}`;
	}

	return (
		<div className={classNames}>
			<WhiteCurve />
		</div>
	);
};

export { Curve };
