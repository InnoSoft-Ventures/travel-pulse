import { Hero } from '../hero';
import { Input } from '../input';
import styles from './destination-header.module.scss';
import SearchIcon from '@/assets/search.svg';

const DestinationHeader = () => {
	return (
		<Hero>
			<div className={styles.destinationContainer}>
				<div>
					<h1 className={styles.title}>
						Discover the power of International eSIM
					</h1>
					<h2 className={styles.subTitle}>
						Explore the world without losing connection. Choose from
						hundreds of data plans and enjoy fast, seamless eSIM
						connectivity tailored for travelers and digital nomads.
					</h2>
				</div>
				<div className={styles.searchContainer}>
					<Input
						icon={<SearchIcon />}
						type="search"
						id="header-search"
						name="destination-search"
						placeholder="Search your destination for 200+ countries and regions"
					/>
				</div>
			</div>
		</Hero>
	);
};

export { DestinationHeader };
