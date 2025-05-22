'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const rawQuery = require('../artifacts/cities-dump.sql');
		await queryInterface.sequelize.query(rawQuery);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('cities', null, {});
	},
};
