import { Sequelize } from 'sequelize';
import dbConfig from '../config/config';

const env = process.env.NODE_ENV || 'development';

// @ts-ignore
const configs = dbConfig[env];

const dbConnect = new Sequelize({
	...configs,
});

dbConnect.authenticate()
	.then(() => {
		console.log('Connected to the database');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

export default dbConnect;
