'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('sims', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			provider_order_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'provider_orders',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			iccid: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			lpa: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			imsis: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			matching_id: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			qrcode: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			qrcode_url: {
				allowNull: false,
				type: Sequelize.TEXT,
			},
			code: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			apn_type: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			apn_value: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			is_roaming: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},
			confirmation_code: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			apn: {
				allowNull: true,
				type: Sequelize.JSON,
			},
			msisdn: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			direct_apple_installation_url: {
				allowNull: false,
				type: Sequelize.TEXT,
			},
			remaining: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			total: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			expired_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			is_unlimited: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},
			status: {
				allowNull: false,
				type: Sequelize.STRING,
				defaultValue: 'NOT_ACTIVE',
			},
			remaining_voice: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			remaining_text: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			total_voice: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
			total_text: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
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
		await queryInterface.dropTable('sims');
	},
};
