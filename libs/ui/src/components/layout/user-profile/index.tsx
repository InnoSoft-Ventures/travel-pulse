import React from 'react';
import styles from './styles.module.scss';
import ArrowIcon from '../../../assets/arrow.svg';
import { Avatar } from '../../common';

interface UserProfileProps {
	firstName: string;
	lastName: string;
	avatarUrl: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
	firstName,
	lastName,
	// avatarUrl,
}) => {
	return (
		<div className={styles.userProfile}>
			<Avatar
				alt={`${firstName} ${lastName}'s avatar`}
				size={30}
				firstName={firstName}
				lastName={lastName}
			/>
			<span className={styles.userName}>{firstName}</span>
			<ArrowIcon className={styles.dropdownIcon} />
		</div>
	);
};
