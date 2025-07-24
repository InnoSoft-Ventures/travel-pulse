import React from 'react';
import styles from './styles.module.scss';
import ArrowIcon from '../../../assets/arrow.svg';
import { Avatar } from '../../common';

interface UserProfileProps {
	name: string;
	avatarUrl: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
	name,
	avatarUrl,
}) => {
	return (
		<div className={styles.userProfile}>
			<Avatar src={avatarUrl} alt={`${name}'s avatar`} size={30} />
			<span className={styles.userName}>{name}</span>
			<ArrowIcon className={styles.dropdownIcon} />
		</div>
	);
};
