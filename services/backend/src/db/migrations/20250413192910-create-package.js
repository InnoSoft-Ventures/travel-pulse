'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('packages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			operator_id: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: 'operators',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			provider: {
				allowNull: false,
				type: Sequelize.STRING(100),
			},
			external_package_id: {
				allowNull: false,
				type: Sequelize.STRING(255),
			},
			/** This could be sim or data */
			type: {
				allowNull: true,
				type: Sequelize.STRING(50),
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING(255),
			},
			price: {
				allowNull: false,
				type: Sequelize.DECIMAL(10, 2),
			},
			amount: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			day: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			is_unlimited: {
				allowNull: true,
				type: Sequelize.BOOLEAN,
			},
			data: {
				allowNull: true,
				type: Sequelize.STRING(50),
			},
			short_info: {
				allowNull: true,
				type: Sequelize.TEXT,
			},
			qr_installation: {
				allowNull: true,
				type: Sequelize.TEXT,
			},
			manual_installation: {
				allowNull: true,
				type: Sequelize.TEXT,
			},
			voice: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			text: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			net_price: {
				allowNull: true,
				type: Sequelize.DECIMAL(10, 2),
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('packages');
	},
};
