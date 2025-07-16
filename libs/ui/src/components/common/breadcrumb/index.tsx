import React from 'react';
import Link from 'next/link';
import Arrow from '../../../assets/arrow.svg';
import HomeIcon from '../../../assets/home.svg';

import styles from './breadcrumb.module.scss';
import { cn } from '../../../utils';

interface BreadcrumbProps {
	className?: string;
	items: { label: string; href?: string }[];
}

function Breadcrumb({ className, items }: BreadcrumbProps) {
	return (
		<nav
			className={cn(styles.breadcrumbContainer, className)}
			aria-label="Breadcrumb"
		>
			<ol>
				<li>
					<Link href="/" className={styles.breadcrumbHomeLink}>
						<HomeIcon />
					</Link>
				</li>
				{items.map((item, index) => {
					const current = items.length - 1 === index;

					return (
						<li
							key={`breadcrumb-item-${index}`}
							{...(current ? { 'aria-current': 'page' } : {})}
						>
							<div className={styles.breadcrumbSeparator}>
								<Arrow className={styles.breadcrumbArrow} />

								{current ? (
									<span className={styles.breadcrumbActive}>
										{item.label}
									</span>
								) : (
									<Link
										href={item.href || '#'}
										className={styles.breadcrumbLink}
									>
										{item.label}
									</Link>
								)}
							</div>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export { Breadcrumb };
