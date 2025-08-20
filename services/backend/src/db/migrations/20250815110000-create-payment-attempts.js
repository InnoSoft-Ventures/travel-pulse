'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('payment_attempts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			order_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'orders', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			provider: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			method: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			status: {
				allowNull: false,
				type: Sequelize.ENUM(
					'initiated',
					'requires_action',
					'paid',
					'failed'
				),
				defaultValue: 'initiated',
			},
			reference_id: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			amount: {
				allowNull: false,
				type: Sequelize.DECIMAL(10, 2),
			},
			currency: {
				allowNull: false,
				type: Sequelize.STRING(3),
			},
			error_code: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			error_message: {
				allowNull: true,
				type: Sequelize.TEXT,
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

		await queryInterface.addIndex(
			'payment_attempts',
			['order_id', 'status'],
			{
				name: 'idx_payment_attempts_order_status',
			}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('payment_attempts');
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_payment_attempts_status";'
		);
	},
};
