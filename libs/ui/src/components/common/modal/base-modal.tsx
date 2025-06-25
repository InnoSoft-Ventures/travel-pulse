'use client';

import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';
import styles from './modal.module.scss';
import { Button } from '../button';
import CloseIcon from '../../../assets/close.svg';

const modalVariants = cva(styles.modal, {
	variants: {
		size: {
			small: styles.smallSize,
			medium: styles.mediumSize,
			large: styles.largeSize,
			xLarge: styles.xlSize,
		},
	},
	defaultVariants: {
		size: 'medium',
	},
});

interface BaseModalProps extends VariantProps<typeof modalVariants> {
	open: boolean;
	title?: string;
	description?: string;
	children?: React.ReactNode;
	onOk?: () => void;
	onCancel: () => void;
	showFooter?: boolean;
	okText?: string;
	cancelText?: string;
	showCloseIcon?: boolean;
	focusTrapped?: boolean;
	center?: boolean;
	className?: string;
}

function BaseModal({
	open,
	title,
	description,
	children,
	onOk,
	onCancel,
	okText = 'OK',
	cancelText = 'Cancel',
	showCloseIcon = true,
	center = true,
	showFooter = true,
	focusTrapped = true,
	size,
	className,
}: BaseModalProps) {
	return (
		<Modal
			open={open}
			onClose={onCancel}
			center={center}
			showCloseIcon={showCloseIcon}
			closeIcon={<CloseIcon />}
			focusTrapped={focusTrapped}
			classNames={{
				modal: cn(modalVariants({ size }), className),
				overlay: styles.overlay,
			}}
		>
			<div className={styles.header}>
				{title && <h2>{title}</h2>}
				{description && <p>{description}</p>}
			</div>

			<div className={styles.body}>{children}</div>

			{showFooter && (
				<div className={styles.footer}>
					<Button type="button" variant="outline" onClick={onCancel}>
						{cancelText}
					</Button>
					{onOk && (
						<Button type="button" onClick={onOk}>
							{okText}
						</Button>
					)}
				</div>
			)}
		</Modal>
	);
}

export { BaseModal as Modal };
