import React from 'react';
import { BaseModal } from '../common';

import styles from './plan-detail-modal.module.scss';

interface PlanDetailModalProps {
	open: boolean;
	onClose: () => void;
}

function PlanDetailModal(props: PlanDetailModalProps) {
	const { open, onClose } = props;

	return (
		<BaseModal
			open={open}
			size="large"
			onCancel={() => onClose()}
			title="Plan details"
			description="Africa eSIM - 1GB for 7 days"
		>
			<div className={styles.planModal}>
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
							<li>
								Hotspot Sharing:{' '}
								<span>
									Includes the ability to share the connection
									via hotspot.
								</span>
							</li>
						</ul>
					</div>

					{/* Additional Info */}
					<div className={styles.section}>
						<h4>Additional Info</h4>
						<ul className={styles.infoList}>
							<li>
								Activation Policy:{' '}
								<span>
									Starts when connected to network, or after
									60 days
								</span>
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
							<li>
								Extra Info:{' '}
								<span>
									Restrictions apply to usage in Turkey (91+
									days)
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Supported Countries */}
				<div className={styles.section}>
					<h4>Supported Countries</h4>
					<input
						type="text"
						placeholder="Search"
						className={styles.searchInput}
					/>
					<ul className={styles.countryList}>
						<li>🇧🇬 Bulgaria</li>
						<li>🇿🇦 South Africa</li>
						<li>🇦🇹 Austria</li>
						{/* ... more countries as needed */}
					</ul>
				</div>

				{/* Configure Plan */}
				<div className={styles.section}>
					<h4>Configure your plan</h4>
					<div className={styles.travelerInput}>
						<span>How many travellers are you buying for?</span>
						<div className={styles.counter}>
							<button>-</button>
							<span>4</span>
							<button>+</button>
						</div>
					</div>
					<div className={styles.datePicker}>
						<span>Plan Activation Day</span>
						<input
							type="text"
							readOnly
							value="2024-09-18 to 2024-09-25"
						/>
					</div>
				</div>

				{/* Total & Button */}
				<div className={styles.footer}>
					<div className={styles.total}>
						Total: <strong>$15.00 USD</strong>
					</div>
					<button className={styles.buyButton}>Buy Now</button>
				</div>
			</div>
		</BaseModal>
	);
}

export { PlanDetailModal };
