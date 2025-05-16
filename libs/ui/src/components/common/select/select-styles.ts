import { StylesConfig } from 'react-select';

export const selectStyles: StylesConfig = {
	container: (css) => ({
		...css,
		width: '100%',
		maxWidth: '380px',
	}),
	control: (css) => ({
		...css,
		paddingLeft: '1rem',
		minHeight: '50px',
		borderRadius: '15px',
		boxShadow: '0 2px 5px rgba(0, 0, 0, 0.22)',
		border: '2px solid transparent',
		backgroundImage:
			'linear-gradient(white, white), var(--purple-gradient)',
		backgroundOrigin: 'border-box',
		backgroundClip: 'padding-box, border-box',
		'&:hover': {
			border: '2px solid transparent',
			backgroundImage:
				'linear-gradient(white, white), var(--purple-gradient)',
			backgroundOrigin: 'border-box',
			backgroundClip: 'padding-box, border-box',
		},
	}),
	clearIndicator: (css) => ({
		...css,
		cursor: 'pointer',
	}),
	dropdownIndicator: (css) => ({
		...css,
		cursor: 'pointer',
	}),
	singleValue: (css) => ({
		...css,
		color: 'var(--dark-purple)',
		fontSize: '14px',
		fontWeight: '400',
		fontFamily: 'Poppins, sans-serif',
	}),
	valueContainer: (css) => ({
		...css,
		cursor: 'text',
	}),
	placeholder: (css) => ({
		...css,
		color: 'var(--light-purple)',
		fontSize: '14px',
		fontWeight: '400',
		fontFamily: 'Poppins, sans-serif',
	}),
	option: (css, { isFocused, isSelected }) => ({
		...css,
		backgroundColor: isSelected
			? 'rgb(129 114 241)'
			: isFocused
			? '#f0effb'
			: 'white',
		color: isSelected ? 'white' : 'var(--dark-purple)',
		fontSize: '14px',
		fontWeight: '400',
		fontFamily: 'Poppins, sans-serif',
		cursor: 'pointer',
		// outline: isFocused && !isSelected ? '1px dotted #000' : 'none',
		// outlineOffset: '-2px',
		'&:active': {
			backgroundColor: '#f0effb',
			color: 'var(--dark-purple)',
		},
		'&:hover': {
			backgroundColor: isSelected ? 'rgb(129 114 241)' : '#f0effb',
			color: isSelected ? 'white' : 'var(--dark-purple)',
		},
	}),
	noOptionsMessage: (css) => ({
		...css,
		color: 'var(--light-purple)',
		fontSize: '14px',
		fontWeight: '400',
		fontFamily: 'Poppins, sans-serif',
	}),
	loadingMessage: (css) => ({
		...css,
		color: 'var(--dark-purple)',
		fontSize: '14px',
		fontWeight: '400',
		fontFamily: 'Poppins, sans-serif',
	}),
};
