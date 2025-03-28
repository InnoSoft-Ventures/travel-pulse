import { Hero } from '@/components/ui/hero';

import styles from './local.module.scss';
import Input from '@/components/ui/input';
import SearchIcon from '@/assets/search.svg';

const LocalDestinationsPage = () => {
	return (
		<>
			<Hero>
				<div className={styles.homeContainer}>
					<div className={styles.contentContainer}>
						<div className={styles.homeContentContainer}>
							<div className={styles.headerText}>
								<h1 className={styles.title}>
									Stay connected wherever you travel, with
									affordable rates.
								</h1>
								<h2 className={styles.subTitle}>
									Explore the world without losing connection.
									Choose from hundreds of data plans and enjoy
									fast, seamless eSIM connectivity tailored
									for travelers and digital nomads.
								</h2>
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
						</div>
					</div>
				</div>
			</Hero>
			<div>
				<h1>Local Destinations</h1>
				<p>Explore the best local destinations around you!</p>
			</div>
		</>
	);
};

export default LocalDestinationsPage;
