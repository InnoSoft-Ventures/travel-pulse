import styles from '../../styles.module.scss';

// Lightweight server component fallback: pure HTML/CSS for instant paint (no Drawer JS chunk needed)
export default function LoadingOrderDrawer() {
	return (
		<div
			className={styles.drawerOverlayLite}
			aria-label="Loading order drawer"
		>
			<div className={styles.drawerLite} role="dialog" aria-modal="true">
				<div className={styles.drawerLiteHeader}>Loading order…</div>
				<div className={styles.drawerLiteBody}>
					<div
						className={styles.skeletonWrapper}
						aria-label="Loading order details"
					>
						<div className={styles.skeletonRow}>
							<div
								className={`${styles.skeletonBlock} ${styles.md}`}
							></div>
							<div
								className={`${styles.skeletonBlock} ${styles.sm}`}
							></div>
						</div>
						<div
							className={styles.skeletonBlock + ' ' + styles.lg}
						></div>
						<div
							className={styles.skeletonBlock + ' ' + styles.tall}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
}
