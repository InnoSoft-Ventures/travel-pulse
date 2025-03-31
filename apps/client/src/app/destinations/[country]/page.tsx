import styles from './country.module.scss';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import toronto from '@/assets/toronto_bg.jpg';
import { Breadcrumb, DestinationHeader, Title } from '@/components/ui';

interface Props {
	params: { country: string };
}

const CountryPage = ({ params }: Props) => {
	const { country } = params;

	const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1);

	// You’ll later replace this with a real API or static data
	const isCountryAvailable = ['canada', 'south-africa'].includes(
		country.toLowerCase()
	);
	if (!isCountryAvailable) return notFound();

	return (
		<>
			<DestinationHeader
				title={`eSIM plans for ${formattedCountry}`}
				subTitle={
					<>
						Discover <strong>{formattedCountry}</strong> with
						seamless connectivity — no roaming fees, no
						interruptions, and effortless eSIM setup.
					</>
				}
			/>
			<div className={styles.countryContainer}>
				<section className={styles.content}>
					<Breadcrumb className={styles.breadcrumbNav} />
					<Title size="size35">Available eSIM plans</Title>
					<Title size="size16" className={styles.subTitle}>
						Choose from our list of {formattedCountry} eSIM plans
					</Title>

					<div className={styles.flexLayout}>
						<div className={styles.imageContainer}>
							<Image
								src={toronto}
								alt={`${formattedCountry} tower`}
								width={300}
								height={400}
								className={styles.countryImage}
							/>
						</div>
						<div>
							<ul>
								<li>
									<strong>Affordable data plans</strong> —
									starting from <strong>$3.99 USD</strong>
								</li>
								<li>
									Reliable connection from the best networks.
								</li>
								<li>You keep your original number.</li>
								<li>
									Compatible with eSIM-enabled smartphones.
								</li>
							</ul>
							<div className={styles.searchBox}>
								<input type="date" /> to <input type="date" />
								<button>Search</button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default CountryPage;
