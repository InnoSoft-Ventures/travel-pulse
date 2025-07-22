import React, { useState, useEffect } from 'react';

interface PurgeStoreButtonProps {
	onPurge: () => void;
}

const PurgeStoreButton: React.FC<PurgeStoreButtonProps> = ({ onPurge }) => {
	const [showPurge, setShowPurge] = useState(false);
	const [keyState, setKeyState] = useState({
		Shift: false,
		P: false,
		G: false,
	});
	const isDevelopment = process.env.NODE_ENV === 'development';

	useEffect(() => {
		if (isDevelopment) {
			console.info(
				'%c🔄 Store Purge Instructions:',
				'font-weight: bold; font-size: 12px; color: #ff4444;'
			);
			console.info(
				'%cPress SHIFT + P + G together to toggle the purge store button',
				'color: #a8e6cf; font-size: 11px; padding: 4px 8px;'
			);
		}
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key;
			if (
				key &&
				(key === 'Shift' ||
					key.toUpperCase() === 'P' ||
					key.toUpperCase() === 'G')
			) {
				setKeyState((prev) => ({
					...prev,
					[key === 'Shift' ? 'Shift' : key.toUpperCase()]: true,
				}));
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			const key = e.key;
			if (
				key &&
				(key === 'Shift' ||
					key.toUpperCase() === 'P' ||
					key.toUpperCase() === 'G')
			) {
				setKeyState((prev) => ({
					...prev,
					[key === 'Shift' ? 'Shift' : key.toUpperCase()]: false,
				}));
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	useEffect(() => {
		if (keyState['Shift'] && keyState['P'] && keyState['G']) {
			setShowPurge((prev) => !prev);
			setKeyState({ Shift: false, P: false, G: false });
		}
	}, [keyState]);

	if (!isDevelopment || !showPurge) return null;

	const storePurge = () => {
		if (isDevelopment) {
			onPurge();
			console.log('StoreProvider - Store purged');

			setTimeout(() => {
				// Reload the page after purging the store
				window.location.reload();
			}, 1500);
		} else {
			console.warn(
				'StoreProvider - Store purge is only available in development mode'
			);
		}
	};

	return (
		<button
			onClick={storePurge}
			style={{
				position: 'fixed',
				top: '10px',
				left: '10px',
				zIndex: 10000,
				backgroundColor: 'red',
				color: 'white',
				border: 'none',
				padding: '5px 8px',
				fontSize: '11px',
				cursor: 'pointer',
			}}
		>
			Purge Store
		</button>
	);
};

export default PurgeStoreButton;
