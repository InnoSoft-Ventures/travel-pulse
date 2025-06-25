'use client';

import React, { useState } from 'react';
import styles from './style.module.scss';
import QouteIcon from '../../assets/qoute.svg';
import { testimonials } from './data';
import Image from 'next/image';

const Testimonial: React.FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const maxIndex = Math.ceil(testimonials.length / 2) - 1;

	const handleDotClick = (index: number) => {
		setCurrentIndex(index);
	};

	const start = currentIndex * 2;
	const visibleTestimonials = testimonials.slice(start, start + 2);

	return (
		<>
			<div className={styles.testimonialSection}>
				<div className={styles.cardsContainer}>
					{visibleTestimonials.map((testimonial, index) => (
						<div key={index} className={styles.card}>
							<div className={styles.top}>
								<div className={styles.quote}>
									<QouteIcon />
								</div>
								<div className={styles.logo}>
									{testimonial.logo}
								</div>
							</div>
							<p className={styles.text}>{testimonial.text}</p>
							<div className={styles.bottom}>
								<Image
									width={65}
									height={65}
									src={testimonial.image}
									alt={testimonial.name}
									className={styles.avatar}
								/>
								<div>
									<div className={styles.name}>
										{testimonial.name}
									</div>
									<div className={styles.title}>
										{testimonial.title}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className={styles.dots}>
					{Array.from({ length: maxIndex + 1 }).map((_, index) => (
						<button
							key={index}
							className={`${styles.dot} ${
								index === currentIndex ? styles.activeDot : ''
							}`}
							onClick={() => handleDotClick(index)}
							title={`Go to testimonial ${index + 1}`}
							aria-label={`Go to testimonial ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export { Testimonial };
