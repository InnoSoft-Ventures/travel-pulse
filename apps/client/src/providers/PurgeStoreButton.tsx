import React, { useState, useEffect, useMemo } from 'react';
import type { Persistor } from 'redux-persist';

interface PurgeStoreButtonProps {
	persistor: Persistor;
}

const PurgeStoreButton: React.FC<PurgeStoreButtonProps> = ({ persistor }) => {
	const [showPurge, setShowPurge] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [keyState, setKeyState] = useState({
		Shift: false,
		P: false,
		G: false,
	});
	const [registeredKeys, setRegisteredKeys] = useState<string[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>(
		{}
	);
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

	// When the purge UI is toggled, refresh the list of persisted keys
	useEffect(() => {
		if (!showPurge) return;
		try {
			const state = persistor.getState?.();
			const keys: string[] = Array.isArray(state?.registry)
				? state!.registry
				: [];
			// Fallback: inspect localStorage
			const lsKeys: string[] = [];
			if (typeof window !== 'undefined' && window.localStorage) {
				for (let i = 0; i < window.localStorage.length; i++) {
					const k = window.localStorage.key(i) || '';
					if (k.startsWith('persist:')) {
						lsKeys.push(k.replace('persist:', ''));
					}
				}
			}
			const merged = Array.from(
				new Set([...(keys || []), ...lsKeys])
			).sort();
			setRegisteredKeys(merged);
			// Initialize selection map
			const initialSel: Record<string, boolean> = {};
			merged.forEach((k) => (initialSel[k] = false));
			setSelectedKeys(initialSel);
		} catch (err) {
			console.warn('PurgeStoreButton: failed to get registry', err);
		}
	}, [showPurge, persistor]);

	const storePurgeAll = () => {
		if (isDevelopment) {
			// Purge everything via persistor
			try {
				// Purge relies on redux-persist API
				persistor.purge?.();
			} catch {
				// no-op
			}
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

	const storePurgeSelected = () => {
		if (!isDevelopment) return;
		const toPurge = Object.keys(selectedKeys).filter(
			(k) => selectedKeys[k]
		);
		if (toPurge.length === 0) return;
		// Remove specific persisted sub-states directly from localStorage
		if (typeof window !== 'undefined') {
			toPurge.forEach((k) => {
				try {
					window.localStorage.removeItem(`persist:${k}`);
				} catch (err) {
					console.warn('Failed to remove key', k, err);
				}
			});
		}
		console.log('StoreProvider - Selected stores purged:', toPurge);
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	};

	const toggleKey = (k: string) => {
		setSelectedKeys((prev) => ({ ...prev, [k]: !prev[k] }));
	};

	const anySelected = useMemo(
		() => Object.values(selectedKeys).some(Boolean),
		[selectedKeys]
	);

	return isDevelopment && showPurge ? (
		<>
			{/* Floating toggle button */}
			<button
				onClick={() => setShowModal(true)}
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

			{/* Centered modal */}
			{showModal && (
				<div
					role="dialog"
					aria-modal="true"
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(0,0,0,0.35)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 10001,
						padding: 16,
					}}
					onClick={() => setShowModal(false)}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						style={{
							width: 'min(92vw, 520px)',
							maxHeight: '80vh',
							overflow: 'auto',
							background: '#fff',
							borderRadius: 8,
							boxShadow:
								'0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
							padding: 16,
							color: '#111827',
							fontFamily:
								'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 8,
							}}
						>
							<h3
								style={{
									margin: 0,
									fontSize: 16,
									fontWeight: 700,
								}}
							>
								Purge persisted store
							</h3>
							<button
								onClick={() => setShowModal(false)}
								style={{
									background: 'transparent',
									border: 'none',
									fontSize: 18,
									cursor: 'pointer',
									lineHeight: 1,
								}}
								aria-label="Close"
							>
								×
							</button>
						</div>
						<p
							style={{
								marginTop: 0,
								marginBottom: 12,
								fontSize: 12,
								color: '#4b5563',
							}}
						>
							Select which persisted state slices to purge. You
							can also purge all states. The page will reload to
							apply changes.
						</p>
						<div
							style={{
								border: '1px solid #e5e7eb',
								borderRadius: 6,
								padding: 8,
								marginBottom: 12,
								background: '#fafafa',
							}}
						>
							{registeredKeys.length === 0 ? (
								<div style={{ fontSize: 12, color: '#6b7280' }}>
									No persisted keys registered yet.
								</div>
							) : (
								<ul
									style={{
										listStyle: 'none',
										padding: 0,
										margin: 0,
									}}
								>
									{registeredKeys.map((k) => (
										<li
											key={k}
											style={{
												display: 'flex',
												alignItems: 'center',
												padding: '6px 4px',
											}}
										>
											<input
												id={`purge-${k}`}
												type="checkbox"
												checked={!!selectedKeys[k]}
												onChange={() => toggleKey(k)}
												style={{ marginRight: 8 }}
											/>
											<label
												htmlFor={`purge-${k}`}
												style={{
													fontSize: 13,
													cursor: 'pointer',
												}}
											>
												{k}
											</label>
										</li>
									))}
								</ul>
							)}
						</div>
						<div
							style={{
								display: 'flex',
								gap: 8,
								justifyContent: 'flex-end',
							}}
						>
							<button
								onClick={storePurgeSelected}
								disabled={!anySelected}
								style={{
									backgroundColor: anySelected
										? '#ef4444'
										: '#fca5a5',
									color: '#fff',
									border: 'none',
									padding: '6px 10px',
									borderRadius: 4,
									fontSize: 12,
									cursor: anySelected
										? 'pointer'
										: 'not-allowed',
								}}
							>
								Purge selected
							</button>
							<button
								onClick={storePurgeAll}
								style={{
									backgroundColor: '#111827',
									color: '#fff',
									border: 'none',
									padding: '6px 10px',
									borderRadius: 4,
									fontSize: 12,
									cursor: 'pointer',
								}}
							>
								Purge all
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	) : null;
};

export default PurgeStoreButton;
