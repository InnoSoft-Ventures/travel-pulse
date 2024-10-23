import React from 'react';
import styles from './search-input.module.scss';
import SearchIcon from '@/assets/search.svg';

interface SearchProps {
	id?: string;
	name?: string;
	placeholder?: string;
}

const Search = (props: SearchProps) => {
	const { id, name, placeholder } = props;

	return (
		<label htmlFor={id} className={styles.searchContainer}>
			<div>
				<SearchIcon />
			</div>
			<input
				type="search"
				id={id}
				name={name}
				placeholder={placeholder}
			/>
		</label>
	);
};

export default Search;
