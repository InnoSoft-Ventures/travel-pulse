import { ErrorInstance } from './api-response';
import { PackageInterface } from './product';

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

	/** The cheapest package price available for the country */
	cheapestPackagePrice?: string;
}

export type CountryPackageInterface = Pick<
	Country,
	'id' | 'name' | 'slug' | 'flag'
>;

export interface Styles {
	readonly [key: string]: string;
}

export interface Continent {
	id: number;
	name: string;
	slug: string;
	aliasList: string[];
	/** The cheapest package price available for the country */
	cheapestPackagePrice?: string;
}

export interface CountryProduct extends Country {
	price: string;
}

export type CountryPackageType =
	| CountryProduct[]
	| PackageInterface[]
	| CountryPackageInterface[]
	| Continent[];

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
