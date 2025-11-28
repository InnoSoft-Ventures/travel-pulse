'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Drop usage/status columns from sims (Phase 2)
		const drops = [
			'remaining',
			'total',
			'expired_at',
			'is_unlimited',
			'status',
			'remaining_voice',
			'remaining_text',
			'total_voice',
			'total_text',
		];

		for (const col of drops) {
			// Guard: ignore if column already removed
			try {
				// eslint-disable-next-line no-await-in-loop
				await queryInterface.removeColumn('sims', col);
			} catch (e) {
				// noop
			}
		}
	},

	async down(queryInterface, Sequelize) {
		// Recreate dropped columns for rollback
		await queryInterface.addColumn('sims', 'remaining', {
			allowNull: false,
			type: Sequelize.INTEGER,
		});
		await queryInterface.addColumn('sims', 'total', {
			allowNull: false,
			type: Sequelize.INTEGER,
		});
		await queryInterface.addColumn('sims', 'expired_at', {
			allowNull: true,
			type: Sequelize.DATE,
		});
		await queryInterface.addColumn('sims', 'is_unlimited', {
			allowNull: false,
			type: Sequelize.BOOLEAN,
		});
		await queryInterface.addColumn('sims', 'status', {
			allowNull: false,
			type: Sequelize.STRING,
			defaultValue: 'NOT_ACTIVE',
		});
		await queryInterface.addColumn('sims', 'remaining_voice', {
			allowNull: false,
			type: Sequelize.INTEGER,
			defaultValue: 0,
		});
		await queryInterface.addColumn('sims', 'remaining_text', {
			allowNull: false,
			type: Sequelize.INTEGER,
			defaultValue: 0,
		});
		await queryInterface.addColumn('sims', 'total_voice', {
			allowNull: false,
			type: Sequelize.INTEGER,
			defaultValue: 0,
		});
		await queryInterface.addColumn('sims', 'total_text', {
			allowNull: false,
			type: Sequelize.INTEGER,
			defaultValue: 0,
		});
	},
};
