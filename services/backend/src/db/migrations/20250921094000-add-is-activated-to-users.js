'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('users', 'is_activated', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});

		await queryInterface.addIndex('users', ['is_activated']);
	},

	async down(queryInterface) {
		await queryInterface.removeIndex('users', ['is_activated']);
		await queryInterface.removeColumn('users', 'is_activated');
	},
};
