const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DATABASE = process.env.DB_NAME || 'demo';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || 'password';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_DIALECT = process.env.DB_DIALECT || 'postgres';

module.exports = {
	development: {
		username: DB_USER,
		password: DB_PASS,
		database: DB_DATABASE,
		port: DB_PORT,
		host: DB_HOST,
		dialect: DB_DIALECT,
		migrationStorageTableName: 'migrations',
	},
	test: {
		username: DB_USER,
		password: DB_PASS,
		database: DB_DATABASE,
		host: DB_HOST,
		dialect: DB_DIALECT,
		migrationStorageTableName: 'migrations',
	},
};
