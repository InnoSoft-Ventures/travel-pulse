import Arrow from '@/assets/arrow.svg';
import HomeIcon from '@/assets/home.svg';

import styles from './breadcrumb.module.scss';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
	className?: string;
}

function Breadcrumb({ className }: BreadcrumbProps) {
	return (
		<nav
			className={cn(styles.breadcrumbContainer, className)}
			aria-label="Breadcrumb"
		>
			<ol>
				<li>
					<Link href="#" className={styles.breadcrumbHomeLink}>
						<HomeIcon />
					</Link>
				</li>
				<li>
					<div className={styles.breadcrumbSeparator}>
						<Arrow className={styles.breadcrumbArrow} />
						<a href="#" className={styles.breadcrumbLink}>
							Destinations
						</a>
					</div>
				</li>
				<li aria-current="page">
					<div className={styles.breadcrumbSeparator}>
						<Arrow className={styles.breadcrumbArrow} />
						<span className={styles.breadcrumbActive}>
							Canada eSIMs
						</span>
					</div>
				</li>
			</ol>
		</nav>
	);
}

export { Breadcrumb };
