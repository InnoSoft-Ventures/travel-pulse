'use client';

import React, { useState } from 'react';
import PhoneCheck from '../../assets/phone-check.svg';
import styles from './compatibility-checker.module.scss';
import { Modal } from '../common/modal';

function CompatibilityChecker() {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				onClick={() => {
					setShowModal(true);
				}}
				className={styles.compatibilityCheckBtn}
			>
				Check compatibility
				<PhoneCheck />
			</button>

			<Modal
				open={showModal}
				size="large"
				onCancel={() => {
					setShowModal(false);
				}}
				onOk={() => {
					setShowModal(false);
				}}
				title="Check your device compatibility"
				description="Enter your phone number to check if your device is compatible with our eSIM plans."
			/>
		</>
	);
}

export { CompatibilityChecker };
