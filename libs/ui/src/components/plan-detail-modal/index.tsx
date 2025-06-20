import React from 'react';
import { Button, Counter, DatePicker, Modal } from '../common';

import styles from './plan-detail-modal.module.scss';
import { Countries, dummyCountries } from '../countries';
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

	return (
		<Modal
			open={open}
			size="large"
			onCancel={() => onClose()}
			showFooter={false}
			className={styles.planModalContainer}
		>
			<div className={styles.planModal}>
				<div className={styles.header}>
					<h2>Plan details</h2>
					<p>Africa eSIM - 1Gb for 7 days</p>
				</div>
				<div className={styles.gridContainer}>
					{/* Features Section */}
					<div className={styles.section}>
						<h4>Features</h4>
						<ul className={styles.infoList}>
							<li>
								Coverage: <strong>135 countries</strong>
							</li>
							<li>
								Data: <strong>2 GB</strong>
							</li>
							<li>
								Price: <strong>$2.20 USD</strong>
							</li>
							<li>
								Plan type: <strong>Data only</strong>
							</li>
							<li>
								Validity: <strong>7 days</strong>
							</li>
							<li>
								Speed: <strong>4G/LTE/5G</strong>
							</li>
							<li className={styles.flexColumn}>
								<span>Hotspot Sharing</span>
								<div>
									Includes the ability to share the connection
									via hotspot.
								</div>
							</li>
						</ul>
					</div>

					{/* Additional Info */}
					<div className={styles.section}>
						<h4>Additional Info</h4>
						<ul className={styles.infoList}>
							<li className={styles.flexColumn}>
								<span>Activation Policy</span>
								<div>
									Plan starts automatically when connected to
									network, or after 60 days
								</div>
							</li>
							<li>
								Top-up option: <strong>Available</strong>
							</li>
							<li>
								Network: <strong>Available networks</strong>
							</li>
							<li>
								eKYC (Verification):{' '}
								<strong>Not required</strong>
							</li>
							<li className={styles.flexColumn}>
								<span>Extra Info:</span>
								<div>
									Restrictions apply to extended usage(over 91
									days) in Turkey according to the local
									legislation.
								</div>
							</li>
						</ul>
					</div>
				</div>

				<div className={styles.gridContainer}>
					{/* Supported Countries */}
					<div className={styles.section}>
						<h4>Supported Countries</h4>
						<Countries data={dummyCountries} />
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
							<strong>$15.00 USD</strong>
						</div>
						<Button className={styles.buyButton}>Buy Now</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export { PlanDetailModal };
