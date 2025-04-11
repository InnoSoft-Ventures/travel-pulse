import React from 'react';
import { Button } from '../common';
import GoogleIcon from '../../assets/google.svg';

import styles from './google-login.module.scss';
import { cn } from '../../utils';

interface GoogleAuthProps extends React.HTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const GoogleAuth = (props: GoogleAuthProps) => {
	const { className, children } = props;

	return (
		<Button className={cn(styles.googleBtn, className)}>
			<GoogleIcon />
			{children}
		</Button>
	);
};

export { GoogleAuth };
