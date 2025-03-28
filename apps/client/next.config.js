// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			oneOf: [
				{
          resourceQuery: /image/, // e.g. import iconUrl from './icon.svg?image'
          type: 'asset/resource',
        },
        {
          use: ['@svgr/webpack'], // e.g. import Icon from './icon.svg'
        },
			],
		});

		return config;
	},
};
