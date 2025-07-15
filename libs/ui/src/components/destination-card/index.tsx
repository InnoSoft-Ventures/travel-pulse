'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ArrowIcon from '../../assets/arrow.svg';
import styles from './style.module.scss';

interface DestinationCardProps {
	flagUrl: string;
	countryName: string;
	slugLink?: string;
	price?: string;
}

const DestinationCard = (props: DestinationCardProps) => {
	const { flagUrl, countryName, price, slugLink } = props;

	const cardContent = (
		<div>
			<div className={styles.details}>
				<div className={styles.destinationCardDetails}>
					<div>
						<Image
							src={flagUrl}
							alt="TF"
							width={36}
							height={20}
							className={styles.flag}
						/>
					</div>
					<span>{countryName}</span>
				</div>
				{price && (
					<div className={styles.startingPrice}>
						Starting from <span>{price}</span>
					</div>
				)}
			</div>
			<div>
				<ArrowIcon className={styles.arrow} />
			</div>
		</div>
	);

	if (slugLink) {
		return (
			<Link
				aria-label="Destination Card"
				role="link"
				href={slugLink}
				title={countryName}
				className={styles.destinationCardContainer}
			>
				{cardContent}
			</Link>
		);
	}

	return (
		<button
			aria-label="Destination Card"
			type="button"
			role="button"
			title={countryName}
			className={styles.destinationCardContainer}
		>
			{cardContent}
		</button>
	);
};

export { DestinationCard };
