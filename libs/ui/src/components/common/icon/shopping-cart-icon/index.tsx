'use client';
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@travelpulse/state';
import styles from './style.module.scss';

export const CartIcon = () => {
	const cart = useAppSelector((state) => state.app.cart);
	const cartSize = cart.items.list.length;

	return (
		<>
			{cartSize > 0 && (
				<Link href="/checkout" className={styles.cartIcon}>
					<ShoppingCart size={20} />
					<span>{cartSize}</span>
				</Link>
			)}
		</>
	);
};
