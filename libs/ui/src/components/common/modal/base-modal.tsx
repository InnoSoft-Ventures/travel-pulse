import React from 'react';
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from './modal-source';
import { Button } from '../button';

import styles from './modal.module.scss';
import { cn } from '../../../utils';
import { cva, VariantProps } from 'class-variance-authority';

const modalVariants = cva(styles.modal, {
	variants: {
		size: {
			medium: styles.mediumSize,
			small: styles.smallSize,
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
	onCancel?: () => void;
	okText?: string;
	cancelText?: string;
}

export function BaseModal(props: BaseModalProps) {
	const {
		open,
		children,
		title,
		description,
		onCancel,
		onOk,
		okText,
		cancelText,
		size,
	} = props;

	return (
		<Modal open={open} onOpenChange={onCancel}>
			<ModalContent className={cn(modalVariants({ size }))}>
				<ModalHeader>
					{title && <ModalTitle>{title}</ModalTitle>}

					{description && (
						<ModalDescription>{description}</ModalDescription>
					)}
				</ModalHeader>
				<main>{children}</main>

				{(cancelText || okText) && (
					<ModalFooter>
						{cancelText && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
							>
								{cancelText}
							</Button>
						)}

						{okText && (
							<Button type="button" onClick={onOk}>
								{okText}
							</Button>
						)}
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
}
