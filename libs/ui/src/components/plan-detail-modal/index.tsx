'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Button, Counter, DatePicker, Modal } from '../common';
import styles from './plan-detail-modal.module.scss';
import { Countries } from '../countries';
import { PackageInterface } from '@travelpulse/interfaces';
import { updateDates, useAppDispatch } from '@travelpulse/state';
import { dateJs, DateRange } from '@travelpulse/utils';

interface PlanDetailModalProps {
	open: boolean;
	data: PackageInterface;
	onClose: () => void;
	startDate: dateJs.Dayjs;
	endDate: dateJs.Dayjs;
}

function PlanDetailModal({
	open,
	onClose,
	data,
	startDate,
	endDate,
}: PlanDetailModalProps) {
	const [quantity, setQuantity] = useState<number>(1);
	const dispatch = useAppDispatch();

	const title = useMemo(() => {
		if (data.continent?.name) return data.continent.name;
		if (Array.isArray(data.countries) && data.countries.length > 0)
			return data.countries[0].name;
		return 'Unknown';
	}, [data.continent, data.countries]);

	const coverage = useMemo(() => {
		if (!data.countries) return 'No coverage';
		if (data.countries.length === 1) return data.countries[0].name;
		if (data.countries.length > 1)
			return `${data.countries.length} countries`;
		return 'No coverage';
	}, [data.countries]);

	const renderNetworks = useCallback(() => {
		const networks = data.networks || [];
		if (networks.length === 0) return 'No network';
		if (networks.length === 1) return networks[0].name;
		return <Button className={styles.viewNetworks}>View Networks</Button>;
	}, [data.networks]);

	const setDates = useCallback(
		(dates: DateRange) => {
			dispatch(
				updateDates({
					start: dates.startDate.toISOString(),
					end: dates.endDate.toISOString(),
				})
			);
		},
		[dispatch]
	);

	const total = useMemo(() => {
		const price = Number(data.price || 0);
		return `$${(price * quantity).toFixed(2)} USD`;
	}, [data.price, quantity]);

	return (
		<Modal
			open={open}
			size="large"
			onCancel={onClose}
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
					{/* Features */}
					<div className={styles.section}>
						<h4>Features</h4>
						<ul className={styles.infoList}>
							<li>
								Coverage: <strong>{coverage}</strong>
							</li>
							<li>
								Data: <strong>{data.data || 'N/A'}</strong>
							</li>
							<li>
								Price:{' '}
								<strong>
									{data.price ? `$${data.price} USD` : 'N/A'}
								</strong>
							</li>
							<li>
								Plan type:{' '}
								<strong>{data.planType || 'N/A'}</strong>
							</li>
							<li>
								Validity:{' '}
								<strong>
									{data.day ? `${data.day} days` : 'N/A'}
								</strong>
							</li>
							<li>
								Speed: <strong>{data.speed || 'N/A'}</strong>
							</li>
							<li className={styles.flexColumn}>
								<span>Hotspot Sharing:</span>
								<div>{data.hotspotSharing || 'N/A'}</div>
							</li>
						</ul>
					</div>

					{/* Additional Info */}
					<div className={styles.section}>
						<h4>Additional Info</h4>
						<ul className={styles.infoList}>
							<li className={styles.flexColumn}>
								<span>Activation Policy:</span>
								<div>{data.activationPolicy || 'N/A'}</div>
							</li>
							<li>
								Top-up option:{' '}
								<strong>{data.topupOption || 'N/A'}</strong>
							</li>
							<li>
								{(data.networks?.length || 0) > 1
									? 'Networks'
									: 'Network'}
								:<strong>{renderNetworks()}</strong>
							</li>
							<li>
								eKYC (Verification):{' '}
								<strong>{data.eKYC || 'N/A'}</strong>
							</li>
							{data.operator?.extraInfo && (
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
						<Countries data={data.countries} />
					</div>

					{/* Configure */}
					<div className={styles.section}>
						<h4>Configure your plan</h4>
						<div className={styles.travelerInput}>
							<div className={styles.title}>
								How many travelers are you buying for?
							</div>
							<Counter
								value={quantity}
								onChange={setQuantity}
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
								dates={{
									startDate,
									endDate,
								}}
								setDates={setDates}
								disabled
								inputClassName={styles.dataInput}
							/>
						</div>
					</div>
				</div>

				<div className={styles.footer}>
					<div>
						<div className={styles.total}>
							<span>Total:</span>
							<strong>{total}</strong>
						</div>
						<Button className={styles.buyButton}>Buy Now</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export { PlanDetailModal };
