import { Hero } from '../hero';
import { Input } from '../input';
import styles from './style.module.scss';
import LocationIcon from '@/assets/location.svg';
import CalendarIcon from '@/assets/calendar.svg';
import SearchIcon from '@/assets/white-search.svg';
import { Button } from '../button';

interface DestinationHeaderProps {
	title: string;
	subTitle: string;
	/**
	 * Enable or disable the search bar
	 * @default true
	 */
	enableSearch?: boolean;
}

const DestinationHeader = (props: DestinationHeaderProps) => {
	const { title, subTitle, enableSearch = true } = props;
	return (
		<Hero>
			<div className={styles.destinationContainer}>
				<div>
					<h1 className={styles.title}>{title}</h1>
					<h2 className={styles.subTitle}>{subTitle}</h2>
				</div>
				{enableSearch && (
					<div className={styles.searchContainer}>
						<Input
							icon={<LocationIcon />}
							type="search"
							id="header-location-search"
							name="location-search"
							size="large"
							placeholder="Where do you need internet?"
						/>
						<Input
							icon={<CalendarIcon />}
							type="text"
							size="large"
							id="arrival-departure-date"
							name="arrival-departure-date"
							placeholder="Arrival & Departure"
						/>
						<div>
							<Button
								size="lg"
								icon={<SearchIcon />}
								className={styles.searchBtn}
							>
								Search
							</Button>
						</div>
					</div>
				)}
			</div>
		</Hero>
	);
};

export { DestinationHeader };
