'use strict';

/**
 * Adds redirect_url (TEXT) and metadata (JSON) columns to payment_attempts.
 */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('payment_attempts', 'redirect_url', {
			type: Sequelize.TEXT,
			allowNull: true,
			after: 'reference_id',
		});

		await queryInterface.addColumn('payment_attempts', 'metadata', {
			type: Sequelize.JSON,
			allowNull: true,
			after: 'redirect_url',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('payment_attempts', 'metadata');
		await queryInterface.removeColumn('payment_attempts', 'redirect_url');
	},
};
