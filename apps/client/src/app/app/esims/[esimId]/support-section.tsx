import React, { memo } from 'react';
import styles from './styles.module.scss';

function SupportSection() {
	return (
		<section className={styles.miscSection}>
			<h2 className={styles.sectionTitle}>More</h2>
			<ul className={styles.miscList}>
				<li>
					<button
						onClick={() => {
							/* view logs */
						}}
					>
						Usage logs
					</button>
				</li>
				<li>
					<button
						onClick={() => {
							/* help/FAQ */
						}}
					>
						Help & FAQs
					</button>
				</li>
				<li>
					<button
						onClick={() => {
							/* contact support */
						}}
					>
						Contact support
					</button>
				</li>
			</ul>
		</section>
	);
}

export default memo(SupportSection);
