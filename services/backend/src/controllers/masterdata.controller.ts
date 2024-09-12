import { Request, Response } from 'express';
import { APIRequest } from '@libs/api-service';
import dbConnect from '../db';
import { QueryTypes } from 'sequelize';
import Continent from '../db/models/Continent';
import Country from '../db/models/Country';
import City from '../db/models/City';

const S = {
	name: {
		common: 'South Georgia',
		official: 'South Georgia and the South Sandwich Islands',
		nativeName: {
			eng: {
				official: 'South Georgia and the South Sandwich Islands',
				common: 'South Georgia',
			},
		},
	},
	tld: ['.gs'],
	cca2: 'GS',
	ccn3: '239',
	cca3: 'SGS',
	independent: false,
	status: 'officially-assigned',
	unMember: false,
	currencies: {
		SHP: {
			name: 'Saint Helena pound',
			symbol: '£',
		},
	},
	idd: {
		root: '+5',
		suffixes: ['00'],
	},
	capital: ['King Edward Point'],
	altSpellings: ['GS', 'South Georgia and the South Sandwich Islands'],
	region: 'Antarctic',
	languages: {
		eng: 'English',
	},
	translations: {
		ara: {
			official: 'جورجيا الجنوبية وجزر ساندوتش الجنوبية',
			common: 'جورجيا الجنوبية',
		},
		bre: {
			official: 'Georgia ar Su hag Inizi Sandwich ar Su',
			common: 'Georgia ar Su hag Inizi Sandwich ar Su',
		},
		ces: {
			official: 'Jižní Georgie a Jižní Sandwichovy ostrovy',
			common: 'Jižní Georgie a Jižní Sandwichovy ostrovy',
		},
		cym: {
			official: 'South Georgia and the South Sandwich Islands',
			common: 'South Georgia',
		},
		deu: {
			official: 'Südgeorgien und die Südlichen Sandwichinseln',
			common: 'Südgeorgien und die Südlichen Sandwichinseln',
		},
		est: {
			official: 'Lõuna-Georgia ja Lõuna-Sandwichi saared',
			common: 'Lõuna-Georgia ja Lõuna-Sandwichi saared',
		},
		fin: {
			official: 'Etelä-Georgia ja Eteläiset Sandwichsaaret',
			common: 'Etelä-Georgia ja Eteläiset Sandwichsaaret',
		},
		fra: {
			official: 'Géorgie du Sud et les îles Sandwich du Sud',
			common: 'Géorgie du Sud-et-les Îles Sandwich du Sud',
		},
		hrv: {
			official: 'Južna Džordžija i Otoci Južni Sendvič',
			common: 'Južna Georgija i otočje Južni Sandwich',
		},
		hun: {
			official: 'Déli-Georgia és Déli-Sandwich-szigetek',
			common: 'Déli-Georgia és Déli-Sandwich-szigetek',
		},
		ita: {
			official: 'Georgia del Sud e isole Sandwich del Sud',
			common: 'Georgia del Sud e Isole Sandwich Meridionali',
		},
		jpn: {
			official: 'サウスジョージア·サウスサンドウィッチ諸島',
			common: 'サウスジョージア・サウスサンドウィッチ諸島',
		},
		kor: {
			official: '조지아',
			common: '조지아',
		},
		nld: {
			official: 'Zuid-Georgië en de Zuidelijke Sandwich-eilanden',
			common: 'Zuid-Georgia en Zuidelijke Sandwicheilanden',
		},
		per: {
			official: 'جزایر جورجیای جنوبی و ساندویچ جنوبی',
			common: 'جزایر جورجیای جنوبی و ساندویچ جنوبی',
		},
		pol: {
			official: 'Georgia Południowa i Sandwich Południowy',
			common: 'Georgia Południowa i Sandwich Południowy',
		},
		por: {
			official: 'Geórgia do Sul e Sandwich do Sul',
			common: 'Ilhas Geórgia do Sul e Sandwich do Sul',
		},
		rus: {
			official: 'Южная Георгия и Южные Сандвичевы острова',
			common: 'Южная Георгия и Южные Сандвичевы острова',
		},
		slk: {
			official: 'Južná Georgia a Južné Sandwichove ostrovy',
			common: 'Južná Georgia a Južné Sandwichove ostrovy',
		},
		spa: {
			official: 'Georgia del Sur y las Islas Sandwich del Sur',
			common: 'Islas Georgias del Sur y Sandwich del Sur',
		},
		srp: {
			official: 'Јужна Џорџија и Јужна Сендвичка Острва',
			common: 'Јужна Џорџија и Јужна Сендвичка Острва',
		},
		swe: {
			official: 'Sydgeorgien',
			common: 'Sydgeorgien',
		},
		tur: {
			official: 'Güney Georgia ve Güney Sandwich Adaları',
			common: 'Güney Georgia ve Güney Sandwich Adaları',
		},
		urd: {
			official: 'جنوبی جارجیا و جزائر جنوبی سینڈوچ',
			common: 'جنوبی جارجیا',
		},
		zho: {
			official: '南乔治亚岛和南桑威奇群岛',
			common: '南乔治亚',
		},
	},
	latlng: [-54.5, -37],
	landlocked: false,
	area: 3903,
	demonyms: {
		eng: {
			f: 'South Georgian South Sandwich Islander',
			m: 'South Georgian South Sandwich Islander',
		},
	},
	flag: '🇬🇸',
	maps: {
		googleMaps: 'https://goo.gl/maps/mJzdaBwKBbm2B81q9',
		openStreetMaps: 'https://www.openstreetmap.org/relation/1983629',
	},
	population: 30,
	car: {
		signs: [''],
		side: 'right',
	},
	timezones: ['UTC-02:00'],
	continents: ['Antarctica'],
	flags: {
		png: 'https://flagcdn.com/w320/gs.png',
		svg: 'https://flagcdn.com/gs.svg',
	},
	coatOfArms: {},
	startOfWeek: 'monday',
	capitalInfo: {
		latlng: [-54.28, -36.5],
	},
};

type CountryTemp = {
	name: {
		common: string;
		official: string;
	};
	ISO2: string;
	ISO3: string;
	capital: string[];
	timezones: string;
	continent: string;
	flag: string;
	demonyms: any;
	region: string;
	currencies: any;
};

/**
 * Construct the countries data
 */
export const processCountries = async (_req: Request, res: Response) => {
	try {
		let data: (typeof S)[] = [];
		const cacheData = await dbConnect.query('SELECT data FROM temp', {
			type: QueryTypes.SELECT,
		});

		if (cacheData.length > 0) {
			// @ts-ignore
			data = JSON.parse(cacheData[0].data) as (typeof S)[];

			console.log('Fetching countries data from the cache');
		} else {
			console.log('Fetching countries data from the API');

			// Call the service to process the countries data
			const result = await APIRequest.get(
				'https://restcountries.com/v3.1/all'
			);
			data = result.data as (typeof S)[];
		}

		const countries: Record<string, CountryTemp[]> = {};

		data.forEach((country) => {
			if (!country.capital) return;

			const data = {
				name: {
					common: country.name.common,
					official: country.name.official,
				},
				ISO2: country.cca2,
				ISO3: country.cca3,
				capital: country.capital,
				timezones: country.timezones[0],
				continent: country.continents[0],
				flag: country.flags.svg,
				demonyms: country.demonyms,
				region: country.region,
				currencies: country.currencies,
			};

			if (!countries[data.continent]) {
				countries[data.continent] = [data];
			} else {
				countries[data.continent].push(data);
			}
		});

		if (cacheData.length === 0) {
			await dbConnect.query(
				{
					query: 'INSERT INTO temp (data) VALUES (?)',
					values: [JSON.stringify(data)],
				},
				{ type: QueryTypes.INSERT }
			);
		}

		const continents = Object.keys(countries).map((continent) => ({
			name: continent,
		}));

		const hasContinents = await Continent.findAll();

		let query = await Continent.findAll();

		if (hasContinents.length === 0) {
			query = await Continent.bulkCreate(continents, {
				ignoreDuplicates: true,
			});
		}

		const continentData: Record<string, number> = {};

		query.forEach((continent) => {
			continentData[continent.name] = continent.id;
		});

		const countryData: Country[][] = [];
		const cities: Record<string, string[]> = {};

		Object.keys(countries).forEach((continent) => {
			const test = countries[continent].map((country) => {
				const currency = Object.keys(country.currencies).map(
					(key) => country.currencies[key]
				)[0];

				cities[country.name.common] = country.capital;

				return {
					name: country.name.common,
					officialName: country.name.official,
					iso2: country.ISO2,
					iso3: country.ISO3,
					capital: country.capital,
					timezone: country.timezones,
					flag: country.flag,
					demonym: country.demonyms.eng.f,
					currencyName: currency.name,
					currencySymbol: currency.symbol,
					continentId: continentData[continent],
				};
			});

			// @ts-ignore
			countryData.push(test);
		});

		const flatten = countryData.flat();

		let countriesData = await Country.findAll();

		if (countriesData.length === 0) {
			countriesData = await Country.bulkCreate(flatten, {
				ignoreDuplicates: true,
			});
		}

		const citylist: City[] = [];

		countriesData.forEach((country) => {
			const countryCities = cities[country.name];

			if (countryCities) {
				countryCities.forEach(async (city) => {
					// @ts-ignore
					citylist.push({
						name: city,
						countryId: country.id,
					});
				});
			}
		});

		let cityData = await City.findAll();

		if (cityData.length === 0) {
			cityData = await City.bulkCreate(citylist, {
				ignoreDuplicates: true,
			});
		}

		return res.status(200).json({ cityData });
	} catch (error) {
		console.error('Error in processCountries', error);

		return res.status(500).json(error);
	}
};
