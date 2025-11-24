import React from 'react';
import styles from './how-it-works.module.scss';
import { Curve } from '../curve';
import { Button, Title } from '../common';
import { SectionCard } from '../section-card';
import MapIcon from '../../assets/map.svg';
import QRcodeIcon from '../../assets/qr-code.svg';
import NetworkIcon from '../../assets/network.svg';
import { cn } from '../../utils';
import Link from 'next/link';

interface HowItWorksProps {
	className?: string;
	destinationName?: string;
}

export const HowItWorks = ({ className, destinationName }: HowItWorksProps) => {
	return (
		<div className={cn(styles.howItWorksContainer, className)}>
			<Curve variant="secondary" />
			<Title position={'center'} className={styles.title}>
				How TravelPulse eSIM works{' '}
				{destinationName && `for ${destinationName}`}
			</Title>
			<div className={styles.secFeatureListContainer}>
				<div>
					<SectionCard
						icon={<MapIcon />}
						title="Choose Your Package"
						description="Select the perfect eSIM for your destination and data needs."
					/>
					<SectionCard
						icon={<QRcodeIcon />}
						title="Scan QR Code"
						description="Using your eSIM-compatible device to scan the QR code we send you via email and WhatsApp to quickly install your eSIM."
					/>
					<SectionCard
						icon={<NetworkIcon />}
						title="Activate and Connect"
						description="When you arrive at your destination, switch to your eSIM
						as the primary data connection and enable roaming to
						join the local network seamlessly."
					/>
				</div>

				<div className={styles.textCenter}>
					<Button
						variant="secondary"
						className={styles.AllDestinations}
						as={Link}
						href="/destinations/local"
					>
						View all destinations
					</Button>
				</div>
			</div>
		</div>
	);
};
