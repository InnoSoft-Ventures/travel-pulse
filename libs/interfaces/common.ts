export interface Country {
	id: number;
	name: string;
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
