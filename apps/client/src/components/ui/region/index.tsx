import React from 'react';
import Image, { StaticImageData } from 'next/image';
import ArrowIcon from '@/assets/arrow-down.svg';
import styles from './region.module.scss';

interface RegionProps {
	imageSrc: string | StaticImageData;
	continentName: string;
	price: string;
}

const Region = (props: RegionProps) => {
	const { imageSrc, continentName, price } = props;

	return (
		<div className={styles.regionContainer}>
			<div>
				<div className={styles.image}>
					<Image
						src={imageSrc}
						alt="TF"
						width={36}
						height={20}
						className={styles.flag}
					/>
				</div>
				<div className={styles.detailsContainer}>
					<div className={styles.details}>
						<div className={styles.regionDetails}>
							<span>{continentName}</span>
						</div>
						<div className={styles.startingPrice}>
							Starting from <span>{price}</span>
						</div>
					</div>
					<div>
						<ArrowIcon />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Region;
