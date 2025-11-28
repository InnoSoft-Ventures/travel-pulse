'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('package_history', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			sim_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'sims',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			provider_order_id: {
				allowNull: true,
				type: Sequelize.INTEGER,
				references: {
					model: 'provider_orders',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
			action_type: {
				allowNull: false,
				type: Sequelize.ENUM('initial_purchase', 'top_up', 'renewal'),
				defaultValue: 'initial_purchase',
			},
			status: {
				allowNull: false,
				type: Sequelize.ENUM(
					'NOT_ACTIVE',
					'ACTIVE',
					'FINISHED',
					'DEACTIVATED',
					'UNKNOWN',
					'EXPIRED',
					'RECYCLED'
				),
				defaultValue: 'NOT_ACTIVE',
			},
			package_id: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			package_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			validity_days: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			price: {
				allowNull: false,
				type: Sequelize.DECIMAL(10, 2),
			},
			net_price: {
				allowNull: true,
				type: Sequelize.DECIMAL(10, 2),
			},
			currency: {
				allowNull: false,
				type: Sequelize.STRING(3),
			},
			activated_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			expires_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			remaining_data: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
				comment: 'Remaining data in MB',
			},
			total_data: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
				comment: 'Total data in MB',
			},
			remaining_voice: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
				comment: 'Remaining voice minutes',
			},
			total_voice: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
				comment: 'Total voice minutes',
			},
			remaining_text: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
				comment: 'Remaining text messages',
			},
			total_text: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
				comment: 'Total text messages',
			},
			is_unlimited: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: false,
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

		// Add index for faster queries
		await queryInterface.addIndex('package_history', ['sim_id'], {
			name: 'package_history_sim_id_idx',
		});

		await queryInterface.addIndex('package_history', ['status'], {
			name: 'package_history_status_idx',
		});

		await queryInterface.addIndex(
			'package_history',
			['sim_id', 'created_at'],
			{
				name: 'package_history_sim_id_created_at_idx',
			}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('package_history');
	},
};
