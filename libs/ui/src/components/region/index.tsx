import React from 'react';
import Image, { StaticImageData } from 'next/image';
import ArrowIcon from '../../assets/arrow.svg';
import styles from './region.module.scss';
import Link from 'next/link';

interface RegionProps {
	imageSrc: string | StaticImageData;
	continentName: string;
	slug: string;
	price: string;
}

const Region = (props: RegionProps) => {
	const { imageSrc, continentName, price, slug } = props;

	return (
		<Link
			href={`/regions/${slug}`}
			title={continentName}
			className={styles.regionContainer}
		>
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
						<ArrowIcon className={styles.arrow} />
					</div>
				</div>
			</div>
		</Link>
	);
};

export { Region };
