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
	'id' | 'name' | 'slug' | 'flag' | 'iso2'
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

export interface CartItem {
	name: string;
	packageId: string;
	flag: string;
	data: string;
	validity: string;
	startDate: string;
	/** Price before the discount is applied */
	originalPrice?: number;
	finalPrice: string;
	quantity: number;
}

export interface CartDetails {
	items: CartItem[];
	details: {
		/** Formatted subtotal price with currency symbol */
		subtotal: string;
		discount: number;
		bundleDiscount: number;
		taxesAndFees: string;
		/** Total price without currency symbol */
		total: number;
		/** Formatted total price with currency symbol */
		totalPrice: string;
		currency: string;
	};
}

export interface Transaction {
	commit: () => Promise<void>;
	rollback: () => Promise<void>;
}
