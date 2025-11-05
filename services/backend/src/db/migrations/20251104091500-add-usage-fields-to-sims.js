'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await Promise.all([
			queryInterface.addColumn('sims', 'last_usage_fetch_at', {
				type: Sequelize.DATE,
				allowNull: true,
			}),
		]);
	},

	async down(queryInterface) {
		await Promise.all([
			queryInterface.removeColumn('sims', 'last_usage_fetch_at'),
		]);
	},
};
