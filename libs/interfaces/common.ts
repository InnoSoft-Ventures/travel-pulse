import { ErrorInstance } from './api-response';

export interface Country {
	id: number;
	name: string;
	slug: string;
	code: string;
	iso2: string;
	iso3: string;
	timezone: string;
	flag: string;
	demonym: string;
	currencyName: string;
	currencySymbol: string;
}

export interface CountryProduct extends Country {
	price: string;
}

export type StateStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Generic state interface for list-based features
export interface ListState<T> {
	list: T[];
	status: StateStatus;
	error: ErrorInstance;
}

// Generic state interface for single-item features
export interface ItemState<T> {
	data: T;
	status: StateStatus;
	error: ErrorInstance;
}
