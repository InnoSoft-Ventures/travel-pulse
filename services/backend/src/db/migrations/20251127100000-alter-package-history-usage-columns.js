'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Add new usage-tracking fields
		await queryInterface.addColumn('package_history', 'remaining_data', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: 'Remaining data in MB',
		});

		await queryInterface.addColumn('package_history', 'total_data', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: 'Total data in MB',
		});

		await queryInterface.addColumn('package_history', 'remaining_voice', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: 'Remaining voice minutes',
		});

		await queryInterface.addColumn('package_history', 'total_voice', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: 'Total voice minutes',
		});

		await queryInterface.addColumn('package_history', 'remaining_text', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: 'Remaining text messages',
		});

		await queryInterface.addColumn('package_history', 'total_text', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: 'Total text messages',
		});

		await queryInterface.addColumn('package_history', 'is_unlimited', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});

		// Drop duplicated columns
		await queryInterface.removeColumn('package_history', 'data_amount');
		await queryInterface.removeColumn('package_history', 'voice_amount');
		await queryInterface.removeColumn('package_history', 'text_amount');
	},

	async down(queryInterface, Sequelize) {
		// Recreate dropped columns
		await queryInterface.addColumn('package_history', 'data_amount', {
			type: Sequelize.INTEGER,
			allowNull: false,
		});
		await queryInterface.addColumn('package_history', 'voice_amount', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
		});
		await queryInterface.addColumn('package_history', 'text_amount', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
		});

		// Remove new usage-tracking fields
		await queryInterface.removeColumn('package_history', 'remaining_data');
		await queryInterface.removeColumn('package_history', 'total_data');
		await queryInterface.removeColumn('package_history', 'remaining_voice');
		await queryInterface.removeColumn('package_history', 'total_voice');
		await queryInterface.removeColumn('package_history', 'remaining_text');
		await queryInterface.removeColumn('package_history', 'total_text');
		await queryInterface.removeColumn('package_history', 'is_unlimited');
	},
};
