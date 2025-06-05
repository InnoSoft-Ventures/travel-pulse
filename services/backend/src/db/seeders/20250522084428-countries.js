'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const rawQuery = fs.readFileSync(
			path.join(__dirname, '../artifacts/countries-dump.sql'),
			'utf8'
		);
		await queryInterface.sequelize.query(rawQuery);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('countries', null, {});
	},
};
