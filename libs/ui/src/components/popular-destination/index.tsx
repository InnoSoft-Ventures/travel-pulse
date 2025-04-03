import React from 'react';
import Image from 'next/image';
import ArrowIcon from '../../assets/arrow.svg';
import styles from './style.module.scss';

interface PopularDestinationProps {
	flagUrl: string;
	countryName: string;
	price: string;
}

const PopularDestination = (props: PopularDestinationProps) => {
	const { flagUrl, countryName, price } = props;

	return (
		<div className={styles.popularDestinationContainer}>
			<div>
				<div className={styles.details}>
					<div className={styles.destinationDetails}>
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
					<div className={styles.startingPrice}>
						Starting from <span>{price}</span>
					</div>
				</div>
				<div>
					<ArrowIcon className={styles.arrow} />
				</div>
			</div>
		</div>
	);
};

export { PopularDestination };
