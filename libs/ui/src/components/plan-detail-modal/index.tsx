import React from 'react';
import { Button, Counter, DatePicker, Modal } from '../common';

import styles from './plan-detail-modal.module.scss';
import { Countries } from '../countries';
import { PackageInterface } from '@travelpulse/interfaces';

interface PlanDetailModalProps {
	open: boolean;
	data: PackageInterface;
	onClose: () => void;
}

function PlanDetailModal(props: PlanDetailModalProps) {
	const { open, onClose, data } = props;
	console.log('PlanDetailModal - data:', data);

	const [quantity, setQuantity] = React.useState<number>(1);

	const title = data.continent?.name
		? data.continent.name
		: Array.isArray(data.countries) && data.countries.length > 0
		? data.countries[0].name
		: 'Unknown';

	let coverage = '';

	if (data.countries.length === 1) {
		coverage = data.countries[0].name;
	} else {
		coverage =
			data.countries.length > 1
				? `${data.countries.length} countries`
				: 'No coverage';
	}

	const renderNetworks = () => {
		const { networks } = data;

		if (networks.length === 0) {
			return 'No network';
		}

		if (networks.length !== 1) {
			return networks[0].name;
		}

		return <Button className={styles.viewNetworks}>View Networks</Button>;
	};

	return (
		<Modal
			open={open}
			size="large"
			onCancel={() => onClose()}
			focusTrapped={false}
			showFooter={false}
			className={styles.planModalContainer}
		>
			<div className={styles.planModal}>
				<div className={styles.header}>
					<h2>Plan details</h2>
					<p>
						{title} eSIM - {data.data || data.amount || 'N/A'} for{' '}
						{data.day ? `${data.day} days` : 'N/A'}
					</p>
				</div>
				<div className={styles.gridContainer}>
					{/* Features Section */}
					<div className={styles.section}>
						<h4>Features</h4>
						<ul className={styles.infoList}>
							{/* Coverage: Not available in data */}
							<li>
								Coverage: <strong>{coverage}</strong>
							</li>
							<li>
								Data:
								<strong>{data.data || 'N/A'}</strong>
							</li>
							<li>
								Price:
								<strong>
									{data.price ? `$${data.price} USD` : 'N/A'}
								</strong>
							</li>
							<li>
								Plan type:
								<strong>{data.planType || 'N/A'}</strong>
							</li>
							<li>
								Validity:
								<strong>
									{data.day ? `${data.day} days` : 'N/A'}
								</strong>
							</li>
							<li>
								Speed: <strong>{data.speed}</strong>
							</li>
							<li className={styles.flexColumn}>
								<span>Hotspot Sharing:</span>
								<div>{data.hotspotSharing}</div>
							</li>
						</ul>
					</div>

					{/* Additional Info */}
					<div className={styles.section}>
						<h4>Additional Info</h4>
						<ul className={styles.infoList}>
							<li className={styles.flexColumn}>
								<span>Activation Policy:</span>
								<div>{data.activationPolicy}</div>
							</li>
							<li>
								Top-up option:
								<strong>{data.topupOption}</strong>
							</li>
							<li>
								{data.networks.length > 1
									? 'Networks'
									: 'Network'}
								:<strong>{renderNetworks()}</strong>
							</li>
							<li>
								eKYC (Verification):
								<strong>{data.eKYC}</strong>
							</li>
							{data.operator.extraInfo && (
								<li className={styles.flexColumn}>
									<span>Extra Info:</span>
									<div>{data.operator.extraInfo}</div>
								</li>
							)}
						</ul>
					</div>
				</div>

				<div className={styles.gridContainer}>
					{/* Supported Countries */}
					<div className={styles.section}>
						<h4>Supported Countries</h4>
						{/* Not in data, still using dummyCountries */}
						<Countries data={data.countries} />
					</div>

					{/* Configure Plan */}
					<div className={styles.section}>
						<h4>Configure your plan</h4>
						<div className={styles.travelerInput}>
							<div className={styles.title}>
								How many travelers are you buying for?
							</div>
							<Counter
								value={quantity}
								onChange={(value) => setQuantity(value)}
								maxValue={100}
								minValue={1}
							/>
						</div>
						<div className={styles.datePicker}>
							<div className={styles.title}>
								Plan Activation Day
							</div>
							<DatePicker
								hideSearchBtn
								inputClassName={styles.dataInput}
							/>
						</div>
					</div>
				</div>

				{/* Total & Button */}
				<div className={styles.footer}>
					<div>
						<div className={styles.total}>
							<span>Total:</span>
							<strong>
								{data.price
									? `$${(
											(Number(data.price) || 0) * quantity
									  ).toFixed(2)} USD`
									: 0}
							</strong>
						</div>
						<Button className={styles.buyButton}>Buy Now</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export { PlanDetailModal };
